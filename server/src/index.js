import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import api from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
// Aceita vários endereços separados por vírgula (ex.: com e sem "www").
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

// Atrás do Nginx: sem isto o limite de requisições enxergaria todo mundo
// como o mesmo IP (o do próprio Nginx) e bloquearia visitantes legítimos.
app.set("trust proxy", 1);

app.use(cors({ origin: CLIENT_ORIGIN }));

app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use("/api", limiter, api);

app.get("/", (_req, res) => res.json({ service: "nova-conexao-api", ok: true }));

app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

app.listen(PORT, HOST, () => {
  console.log(`✅ API Nova Conexão rodando em http://${HOST}:${PORT}`);
});
