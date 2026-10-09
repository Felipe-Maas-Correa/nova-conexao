import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../lib/whatsapp";

// Botão flutuante de WhatsApp: presença constante, sem exagero visual.
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          href={whatsappLink("Olá! Vim pelo site e quero saber mais.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-[#04131c] shadow-md transition-transform duration-200 hover:scale-105"
        >
          <MessageCircle size={22} strokeWidth={2.25} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
