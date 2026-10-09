import { Router } from "express";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { plans } from "../data/plans.js";
import { coverage } from "../data/coverage.js";
import { testimonials } from "../data/testimonials.js";
import { getGoogleReviews } from "../lib/googleReviews.js";

const router = Router();

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "5555996556467";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contato@novaconexao.net.br";

router.get("/health", (_req, res) => res.json({ ok: true }));

router.get("/plans", (_req, res) => res.json({ plans }));

router.get("/coverage", (_req, res) => res.json(coverage));

router.get("/testimonials", async (_req, res) => {
  try {
    const g = await getGoogleReviews();
    if (g && g.reviews.length) {
      return res.json({
        testimonials: g.reviews,
        fonte: "google",
        rating: g.rating,
        total: g.total,
        placeUrl: g.placeUrl
      });
    }
  } catch (e) {
    console.warn("[testimonials] falha no Google, usando local:", e.message);
  }
  res.json({ testimonials, fonte: "local" });
});

router.get("/contact-info", (_req, res) =>
  res.json({ whatsapp: WHATSAPP_NUMBER, email: CONTACT_EMAIL })
);

// Recebe formulário de suporte/contato
// Pasta onde os contatos recebidos ficam guardados (um JSON por linha).
const PASTA_DADOS = process.env.DATA_DIR || path.resolve("data-local");

router.post("/support", async (req, res) => {
  const { nome, email, telefone, cidade, assunto, mensagem } = req.body || {};

  const errors = {};
  if (!nome || nome.trim().length < 2) errors.nome = "Informe seu nome.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "E-mail inválido.";
  if (!mensagem || mensagem.trim().length < 5)
    errors.mensagem = "Descreva um pouco mais sua mensagem.";

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ ok: false, errors });
  }

  const protocolo = "NC" + Date.now().toString().slice(-8);
  const registro = {
    protocolo,
    recebidoEm: new Date().toISOString(),
    nome,
    email,
    telefone,
    cidade,
    assunto,
    mensagem
  };
  console.log("[support] novo contato", protocolo);

  // Guarda em arquivo para nenhuma mensagem se perder (consulte com
  // `cat contatos.jsonl`). Falha de gravação não pode derrubar o envio.
  try {
    await mkdir(PASTA_DADOS, { recursive: true });
    await appendFile(
      path.join(PASTA_DADOS, "contatos.jsonl"),
      JSON.stringify(registro) + "\n"
    );
  } catch (e) {
    console.error("[support] não foi possível gravar o contato:", e.message);
    console.log("[support] dados:", registro);
  }

  return res.json({
    ok: true,
    protocolo,
    mensagem: "Recebemos sua mensagem! Nossa equipe entrará em contato em breve."
  });
});

export default router;
