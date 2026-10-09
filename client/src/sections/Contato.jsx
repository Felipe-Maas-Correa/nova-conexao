import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  ArrowUpRight
} from "lucide-react";
import Reveal from "../components/Reveal";
import Palavras from "../components/Palavras";
import { Container, Section, Button } from "../components/ui";
import { api } from "../lib/api";
import { whatsappLink, WHATSAPP_NUMBER } from "../lib/whatsapp";
import { links } from "../lib/links";

const initial = {
  nome: "",
  email: "",
  telefone: "",
  cidade: "",
  assunto: "suporte",
  mensagem: ""
};

function validateField(name, value) {
  switch (name) {
    case "nome":
      return value.trim().length < 2 ? "Informe seu nome completo." : "";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "E-mail inválido.";
    case "mensagem":
      return value.trim().length < 5
        ? "Conte um pouco mais (mín. 5 caracteres)."
        : "";
    default:
      return "";
  }
}

function Canal({ icon: Icon, titulo, detalhe, href, external }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`flex items-center gap-3.5 py-3.5 ${
        href ? "group transition-colors duration-200" : ""
      }`}
    >
      <Icon
        size={18}
        className="shrink-0 text-content-faint transition-colors duration-200 group-hover:text-brand-400"
        strokeWidth={1.75}
      />
      <div className="min-w-0">
        <div className="text-small font-medium text-content">{titulo}</div>
        <div className="truncate text-small text-content-muted">{detalhe}</div>
      </div>
      {href && (
        <ArrowUpRight
          size={16}
          aria-hidden
          className="ml-auto shrink-0 text-content-faint transition-all duration-300 ease-out group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-brand-400"
        />
      )}
    </Tag>
  );
}

export default function Contato() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [protocolo, setProtocolo] = useState(null);
  const [contact, setContact] = useState({
    whatsapp: WHATSAPP_NUMBER,
    email: links.email
  });

  useEffect(() => {
    api.getContactInfo().then((r) => {
      if (r.ok && r.data?.whatsapp) setContact(r.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const isValid =
    !validateField("nome", form.nome) &&
    !validateField("email", form.email) &&
    !validateField("mensagem", form.mensagem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      nome: validateField("nome", form.nome),
      email: validateField("email", form.email),
      mensagem: validateField("mensagem", form.mensagem)
    };
    setErrors(newErrors);
    setTouched({ nome: true, email: true, mensagem: true });
    if (Object.values(newErrors).some(Boolean)) return;

    setStatus("loading");
    const r = await api.sendSupport(form);
    if (r.ok && r.data?.ok) {
      setProtocolo(r.data.protocolo);
      setStatus("success");
      setForm(initial);
      setTouched({});
    } else if (r.status === 422 && r.data?.errors) {
      setErrors(r.data.errors);
      setStatus("idle");
    } else {
      setStatus("error");
    }
  };

  const canais = [
    {
      icon: MessageCircle,
      titulo: "WhatsApp",
      detalhe: "Atendimento imediato",
      href: whatsappLink("Olá! Preciso de suporte.", contact.whatsapp),
      external: true
    },
    {
      icon: Phone,
      titulo: "Telefone",
      detalhe: links.telefone,
      href: `tel:+${contact.whatsapp}`
    },
    {
      icon: Mail,
      titulo: "E-mail",
      detalhe: contact.email,
      href: `mailto:${contact.email}`
    },
    {
      icon: Instagram,
      titulo: "Instagram",
      detalhe: "@novaconexaointernet",
      href: links.instagram,
      external: true
    },
    {
      icon: Facebook,
      titulo: "Facebook",
      detalhe: "Nova Conexão Internet",
      href: links.facebook,
      external: true
    },
    {
      icon: MapPin,
      titulo: "Nossa loja",
      detalhe: links.endereco,
      href: links.mapsRota,
      external: true
    }
  ];

  const fieldClass = (name) =>
    `field ${touched[name] && errors[name] ? "field-error" : ""}`;

  return (
    <Section id="contato" size="md" divider>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          {/* Canais */}
          <div>
            <Reveal efeito="deslizar">
              <p className="eyebrow">Contato</p>
            </Reveal>
            <Palavras as="h2" className="h2 mt-2.5" delay={0.1}>
              Precisa de ajuda?
            </Palavras>
            <Reveal efeito="subir" delay={0.3}>
              <p className="lead mt-4">
                Time local e resposta rápida. Escolha o canal que preferir.
              </p>
            </Reveal>

            {/* cada canal entra deslizando da esquerda, em sequência */}
            <div className="mt-7 divide-y divide-line border-y border-line">
              {canais.map((c, i) => (
                <Reveal key={c.titulo} efeito="esquerda" delay={0.15 + i * 0.08}>
                  <Canal {...c} />
                </Reveal>
              ))}
            </div>

            <Reveal efeito="fade" delay={0.7}>
              <p className="mt-4 flex items-center gap-2 text-small text-content-faint">
                <Clock size={14} /> {links.horario}
              </p>
            </Reveal>
          </div>

          {/* Formulário */}
          <Reveal efeito="direita" delay={0.15} duration={1}>
            <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <CheckCircle2 size={40} className="text-emerald-400" />
                  <h3 className="h3 mt-5">Mensagem enviada</h3>
                  <p className="muted mt-2 max-w-sm">
                    Nossa equipe entrará em contato em breve. Guarde seu
                    protocolo:
                  </p>
                  <span className="mt-4 rounded-md border border-line bg-bg-soft px-3.5 py-1.5 font-mono text-small font-semibold text-brand-300">
                    {protocolo}
                  </span>
                  <Button
                    onClick={() => setStatus("idle")}
                    variant="secondary"
                    className="mt-7"
                  >
                    Enviar outra mensagem
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nome" className="field-label">
                        Nome *
                      </label>
                      <input
                        id="nome"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={fieldClass("nome")}
                        placeholder="Seu nome"
                        aria-invalid={!!(touched.nome && errors.nome)}
                      />
                      {touched.nome && errors.nome && (
                        <p className="mt-1.5 text-small text-red-400">
                          {errors.nome}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="telefone" className="field-label">
                        Telefone
                      </label>
                      <input
                        id="telefone"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        className="field"
                        placeholder="(55) 9 9999-9999"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="field-label">
                        E-mail *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={fieldClass("email")}
                        placeholder="voce@email.com"
                        aria-invalid={!!(touched.email && errors.email)}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-1.5 text-small text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cidade" className="field-label">
                        Cidade
                      </label>
                      <select
                        id="cidade"
                        name="cidade"
                        value={form.cidade}
                        onChange={handleChange}
                        className="field"
                      >
                        <option value="">Selecione</option>
                        <option>Ajuricaba</option>
                        <option>Nova Ramada</option>
                        <option>Condor</option>
                        <option>Panambi</option>
                        <option>Ijuí</option>
                        <option>Outra</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="assunto" className="field-label">
                      Assunto
                    </label>
                    <select
                      id="assunto"
                      name="assunto"
                      value={form.assunto}
                      onChange={handleChange}
                      className="field"
                    >
                      <option value="suporte">Suporte técnico</option>
                      <option value="contratar">Quero contratar</option>
                      <option value="financeiro">Financeiro / 2ª via</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="field-label">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={5}
                      value={form.mensagem}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${fieldClass("mensagem")} resize-none`}
                      placeholder="Como podemos ajudar?"
                      aria-invalid={!!(touched.mensagem && errors.mensagem)}
                    />
                    {touched.mensagem && errors.mensagem && (
                      <p className="mt-1.5 text-small text-red-400">
                        {errors.mensagem}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <p className="text-small text-red-400">
                      Não foi possível enviar. Tente novamente ou chame no
                      WhatsApp.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "loading" || !isValid}
                    size="lg"
                    className="w-full"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Enviando
                      </>
                    ) : (
                      "Enviar mensagem"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
