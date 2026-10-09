// Número padrão (fallback). Em produção vem de /api/contact-info.
export const WHATSAPP_NUMBER = "5555996556467";

export function whatsappLink(mensagem, numero = WHATSAPP_NUMBER) {
  const texto = encodeURIComponent(mensagem || "Olá! Gostaria de mais informações sobre os planos.");
  return `https://wa.me/${numero}?text=${texto}`;
}

export function planWhatsappLink(plano, numero) {
  return whatsappLink(
    `Olá, Nova Conexão! Tenho interesse no plano ${plano.nome} (${plano.velocidade}${plano.unidade}). Podem me ajudar?`,
    numero
  );
}
