import type { Express } from "express";
import type { Server } from "http";
import { storage, seedData } from "./storage";
import { analyzeMachine } from "./mlEngine";
import type { MachineStatus } from "../shared/schema";

let simulationInterval: NodeJS.Timeout | null = null;
let tickCount = 0;

export async function registerRoutes(server: Server | null, app: Express): Promise<Server | null> {

  // ============ MACHINES ============

  app.get("/api/machines", async (_, res) => {
    res.json(await storage.getMachines());
  });

  app.post("/api/machines", async (req, res) => {
    const machine = await storage.createMachine(req.body);
    res.status(201).json(machine);
  });

  app.get("/api/machines/:id", async (req, res) => {
    const machine = await storage.getMachine(Number(req.params.id));
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    res.json(machine);
  });

  app.get("/api/machines/:id/readings", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    res.json(await storage.getReadings(Number(req.params.id), limit));
  });

  // ============ AI ANALYSIS ============

  app.post("/api/machines/:id/analyze", async (req, res) => {
    const machine = await storage.getMachine(Number(req.params.id));
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const readings = await storage.getReadings(machine.id, 50);
    const report = analyzeMachine(machine, readings);

    // Update machine status based on analysis
    await storage.updateMachine(machine.id, { status: report.status });

    // Save to history
    await storage.saveAnalysis(report);

    // Generate alerts based on analysis
    for (const sr of report.sensorRisks) {
      if (sr.score < 30) {
        await storage.addAlert({
          machineId: machine.id,
          machineName: machine.name,
          severity: "critical",
          message: `${sr.sensor} critically low health (${sr.score}%)`,
          sensor: sr.sensor,
          value: sr.score,
          threshold: 30,
          acknowledged: false,
          timestamp: new Date().toISOString(),
        });
      } else if (sr.anomalyDetected) {
        await storage.addAlert({
          machineId: machine.id,
          machineName: machine.name,
          severity: "warning",
          message: `Anomaly detected in ${sr.sensor} sensor`,
          sensor: sr.sensor,
          value: sr.score,
          threshold: 50,
          acknowledged: false,
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.json(report);
  });

  app.get("/api/machines/:id/analysis-history", async (req, res) => {
    res.json(await storage.getAnalysisHistory(Number(req.params.id)));
  });

  // ============ ALERTS ============

  app.get("/api/alerts", async (_, res) => {
    res.json(await storage.getAlerts());
  });

  app.post("/api/alerts/:id/acknowledge", async (req, res) => {
    const alert = await storage.acknowledgeAlert(Number(req.params.id));
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  });

  // ============ MAINTENANCE ============

  app.get("/api/maintenance", async (req, res) => {
    const machineId = req.query.machineId ? Number(req.query.machineId) : undefined;
    res.json(await storage.getMaintenanceRecords(machineId));
  });

  app.get("/api/machines/:id/maintenance", async (req, res) => {
    res.json(await storage.getMaintenanceRecords(Number(req.params.id)));
  });

  app.post("/api/maintenance", async (req, res) => {
    const record = await storage.addMaintenanceRecord(req.body);
    res.status(201).json(record);
  });

  // ============ REPORTS ============

  app.get("/api/reports/fleet-summary", async (_, res) => {
    const machines = await storage.getMachines();
    const alerts = await storage.getAlerts();
    const maintenance = await storage.getMaintenanceRecords();

    const healthyCount = machines.filter((m) => m.status === "healthy").length;
    const warningCount = machines.filter((m) => m.status === "warning").length;
    const criticalCount = machines.filter((m) => m.status === "critical").length;

    // Department health
    const departments = Array.from(new Set(machines.map((m) => m.department)));
    const departmentHealth = departments.map((dept) => {
      const deptMachines = machines.filter((m) => m.department === dept);
      const healthScore =
        deptMachines.reduce((sum, m) => {
          if (m.status === "healthy") return sum + 90;
          if (m.status === "warning") return sum + 55;
          return sum + 20;
        }, 0) / deptMachines.length;
      return { department: dept, healthScore: Math.round(healthScore), machineCount: deptMachines.length };
    });

    const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
    const criticalAlerts = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;

    res.json({
      totalMachines: machines.length,
      healthyCount,
      warningCount,
      criticalCount,
      averageHealthScore: Math.round(
        (healthyCount * 90 + warningCount * 55 + criticalCount * 20) / (machines.length || 1)
      ),
      totalAlerts: alerts.filter((a) => !a.acknowledged).length,
      criticalAlerts,
      predictedFailuresThisWeek: criticalCount + Math.floor(warningCount * 0.3),
      totalMaintenanceCost: Math.round(totalCost),
      averageUptime: Math.round(((healthyCount + warningCount * 0.7) / (machines.length || 1)) * 100),
      departmentHealth,
    });
  });

  // ============ TELEMETRY INGESTION & SIMULATION ============

  app.get("/api/simulation/status", async (_, res) => {
    res.json({ running: !!simulationInterval, tickCount });
  });

  app.post("/api/simulation/toggle", async (req, res) => {
    const { running } = req.body;
    if (running && !simulationInterval) {
      startSimulation();
    } else if (!running && simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
    res.json({ running: !!simulationInterval });
  });

  // Initialize
  seedData();
  startSimulation();

  return server;
}

// ===================== SMART SIMULATION =====================

function startSimulation() {
  if (simulationInterval) return;

  simulationInterval = setInterval(async () => {
    tickCount++;
    const machines = await storage.getMachines();

    for (const m of machines) {
      const degradation = getDegradationFactor(m, tickCount);
      const hasAnomaly = Math.random() < 0.03; // 3% chance of anomaly per tick

      const reading = {
        machineId: m.id,
        temperature: simulateSensor(m.specifications.maxTemp, 0.55, 0.45, degradation, hasAnomaly),
        vibration: simulateSensor(m.specifications.maxVibration, 0.4, 0.5, degradation, hasAnomaly),
        current: simulateSensor(m.specifications.maxCurrent, 0.5, 0.45, degradation, hasAnomaly),
        pressure: m.specifications.maxPressure > 0
          ? simulateSensor(m.specifications.maxPressure, 0.6, 0.35, degradation, hasAnomaly)
          : 0,
        humidity: simulateSensor(m.specifications.maxHumidity, 0.5, 0.3, degradation, false),
        rpm: m.specifications.maxRpm > 0
          ? simulateSensor(m.specifications.maxRpm, 0.7, 0.25, degradation, hasAnomaly)
          : 0,
        status: m.status as MachineStatus,
      };

      await storage.addReading(reading);

      // Occasionally generate alerts based on readings
      if (tickCount % 10 === 0) {
        if (reading.temperature > m.specifications.maxTemp * 0.9) {
          await storage.addAlert({
            machineId: m.id,
            machineName: m.name,
            severity: reading.temperature > m.specifications.maxTemp * 0.95 ? "critical" : "warning",
            message: `Temperature at ${reading.temperature.toFixed(1)}°C (max: ${m.specifications.maxTemp}°C)`,
            sensor: "Temperature",
            value: reading.temperature,
            threshold: m.specifications.maxTemp,
            acknowledged: false,
            timestamp: new Date().toISOString(),
          });
        }
        if (reading.vibration > m.specifications.maxVibration * 0.85) {
          await storage.addAlert({
            machineId: m.id,
            machineName: m.name,
            severity: reading.vibration > m.specifications.maxVibration * 0.95 ? "critical" : "warning",
            message: `Vibration at ${reading.vibration.toFixed(2)}mm (max: ${m.specifications.maxVibration}mm)`,
            sensor: "Vibration",
            value: reading.vibration,
            threshold: m.specifications.maxVibration,
            acknowledged: false,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Slowly increment runtime
      m.totalRuntimeHours += 0.001;
    }
  }, 2000);
}

function getDegradationFactor(machine: any, tick: number): number {
  // Each machine degrades at different rates based on runtime and status
  const runtimeFactor = Math.min(machine.totalRuntimeHours / 30000, 1);
  const statusFactor = machine.status === "critical" ? 0.15 : machine.status === "warning" ? 0.08 : 0;
  // Sinusoidal variation to simulate shift patterns
  const cyclic = Math.sin(tick * 0.05 + machine.id) * 0.05;
  return runtimeFactor * 0.1 + statusFactor + cyclic;
}

function simulateSensor(
  maxSpec: number,
  baseFraction: number,
  randomRange: number,
  degradation: number,
  hasAnomaly: boolean
): number {
  let value = maxSpec * (baseFraction + Math.random() * randomRange + degradation);
  if (hasAnomaly) {
    value *= 1.15 + Math.random() * 0.2; // spike 15-35% above normal
  }
  // Add small noise
  value += (Math.random() - 0.5) * maxSpec * 0.02;
  return Math.max(0, parseFloat(value.toFixed(2)));
}
