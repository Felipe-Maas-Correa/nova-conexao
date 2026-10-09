import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import WhatsAppFab from "./components/WhatsAppFab";
import Hero from "./sections/Hero";

// Seções abaixo da dobra: carregadas sob demanda (melhora o carregamento inicial).
const Planos = lazy(() => import("./sections/Planos"));
const Cobertura = lazy(() => import("./sections/Cobertura"));
const Velocidade = lazy(() => import("./sections/Velocidade"));
const Sobre = lazy(() => import("./sections/Sobre"));
const FAQ = lazy(() => import("./sections/FAQ"));
const Contato = lazy(() => import("./sections/Contato"));

function SectionFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-brand-500" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      {/* overflow-x: clip — elementos que entram deslizando de fora da tela
          (efeitos esquerda/direita) não podem criar rolagem horizontal. */}
      <main className="overflow-x-clip">
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <Planos />
          <Cobertura />
          <Velocidade />
          <Sobre />
          <FAQ />
          <Contato />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
