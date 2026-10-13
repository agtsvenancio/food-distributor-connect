import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { LeadForm } from "@/components/lead-form";
import warehouse from "@/assets/food-distribution.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Marketing para distribuidoras de alimentos | Scase" },
    { name: "description", content: "Conquiste novos clientes e gere mais oportunidades para sua distribuidora de alimentos com Google, Meta e estratégia comercial. Fale com a Scase." },
    { property: "og:title", content: "Marketing para distribuidoras de alimentos | Scase" },
    { property: "og:description", content: "Mais clientes, mais oportunidades e mais vendas para sua distribuidora. Conheça a estratégia da Scase." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <>
    <main>
      <section className="hero">
        <img className="hero-photo" src={warehouse} alt="Centro de distribuição de alimentos com produtos frescos e mercadorias organizadas" width={1920} height={1088} fetchPriority="high"/>
        <div className="site-wrap">
          <header className="site-header"><Brand/><span className="header-label">Para distribuidoras de alimentos</span></header>
          <div className="hero-copy">
            <div className="eyebrow">Distribuidoras de alimentos</div>
            <h1>Marketing para<br/>distribuidoras de<br/>alimentos que<br/>precisam <span>vender mais.</span></h1>
            <p className="hero-description">Google, Meta e estratégia comercial para conquistar novos clientes, gerar oportunidades e levar sua distribuidora mais longe.</p>
            <Button asChild className="hero-cta"><a href="#formulario">Quero aumentar minhas vendas<ArrowRight/></a></Button>
            <div className="hero-note"><ShieldCheck/><span>Sem compromisso.</span><span>Uma conversa sobre crescimento.</span></div>
          </div>
        </div>
      </section>
      <section className="qualification" id="formulario" aria-labelledby="qualification-title">
        <div className="form-intro"><div className="eyebrow"><Clock3 size={12}/>Leva cerca de 2 minutos</div><h2 id="qualification-title">O próximo passo começa aqui.</h2><p>Queremos entender seu negócio para traçar o melhor caminho.</p></div>
        <LeadForm/>
      </section>
    </main>
    <footer className="site-footer"><Brand/><span className="footer-label">© 2026 Scase · Estratégia que gera crescimento.</span></footer>
  </>;
}
