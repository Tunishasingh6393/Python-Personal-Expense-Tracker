import express from "express";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Initialize and Ingest
  app.post("/api/init", (req, res) => {
    console.log("Initializing database and generating synthetic data...");
    exec("python3 python_logic/models.py && python3 python_logic/ingest.py && python3 python_logic/categorize.py", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: "Database initialized and data ingested", output: stdout });
    });
  });

  // API Route: Get Analytics
  app.get("/api/analytics", (req, res) => {
    exec("python3 python_logic/analyze.py", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: error.message, stderr });
      }
      try {
        const data = JSON.parse(stdout);
        res.json(data);
      } catch (e) {
        res.status(500).json({ error: "Failed to parse Python output", output: stdout });
      }
    });
  });

  // API Route: Upload CSV
  app.post("/api/upload", (req, res) => {
    // In a real app, we'd handle file upload. For this demo, we'll just allow triggering a re-ingest
    exec("python3 python_logic/ingest.py && python3 python_logic/categorize.py", (error, stdout, stderr) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json({ message: "Processed data" });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
