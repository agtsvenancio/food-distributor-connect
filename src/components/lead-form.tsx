import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { contactSchema, questions } from "@/lib/lead-schema";
import { submitLead } from "@/lib/leads.functions";

const fields = [
  { key: "full_name", label: "Nome completo", placeholder: "Seu nome completo", type: "text", autoComplete: "name", maxLength: 100 },
  { key: "company_name", label: "Nome da empresa", placeholder: "Nome da sua distribuidora", type: "text", autoComplete: "organization", maxLength: 150 },
  { key: "email", label: "E-mail corporativo", placeholder: "voce@suaempresa.com.br", type: "email", autoComplete: "email", maxLength: 255 },
  { key: "phone", label: "Telefone / WhatsApp", placeholder: "(00) 00000-0000", type: "tel", autoComplete: "tel", maxLength: 20 },
] as const;

export function LeadForm() {
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ full_name: "", company_name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submissionId = useRef<string | undefined>(undefined);
  const heading = useRef<HTMLHeadingElement>(null);
  const saveLead = useServerFn(submitLead);
  const question = step > 0 ? questions[step - 1] : undefined;
  const move = (next: number) => { setStep(next); setErrors({}); requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })); };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (step === 0) {
      const parsed = contactSchema.safeParse(contact);
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next); return;
      }
      move(1); return;
    }
    if (!question || answers[question.key] === undefined) { setErrors({ selection: "Selecione uma opção para continuar." }); return; }
    if (step < 4) { move(step + 1); return; }
    if (!consent) { setErrors({ consent: "Autorize o contato para enviar suas informações." }); return; }
    submissionId.current ??= crypto.randomUUID();
    setBusy(true); setErrors({});
    try {
      const result = await saveLead({ data: { ...contact, submission_id: submissionId.current, company_size: answers["company_size"], acquisition_channel: answers["acquisition_channel"], marketing_budget: answers["marketing_budget"], main_goal: answers["main_goal"], consent: true, website } });
      if (result.ok) { setDone(true); requestAnimationFrame(() => heading.current?.focus()); }
      else setErrors({ submit: "Não foi possível enviar agora. Suas respostas foram mantidas; tente novamente." });
    } catch { setErrors({ submit: "Não foi possível enviar agora. Verifique sua conexão e tente novamente." }); }
    finally { setBusy(false); }
  }

  if (done) return <div className="lead-form success" role="status"><div className="success-icon"><Check size={28}/></div><h3 className="form-heading" ref={heading} tabIndex={-1}>Recebemos suas informações!</h3><p>Obrigado pelo interesse na Scase.<br/>Nossa equipe entrará em contato para conversar sobre os próximos passos da sua distribuidora.</p></div>;

  return <form className="lead-form" onSubmit={handleSubmit} noValidate>
    <div className="step-meta"><span>Etapa {step + 1} de 5</span><span>{(step + 1) * 20}%</span></div>
    <div className="progress-track" role="progressbar" aria-label="Progresso do formulário" aria-valuenow={(step + 1) * 20} aria-valuemin={0} aria-valuemax={100}>{[0,1,2,3,4].map(i => <span key={i} className={`progress-segment${i <= step ? " active" : ""}`}/>)}</div>
    <h3 className="form-heading" ref={heading} tabIndex={-1}>{question?.title ?? "Vamos nos conhecer."}</h3>
    <p className="form-subtitle">{step === 0 ? "Primeiro, conte um pouco sobre você e sua empresa." : "Selecione a opção que melhor representa sua empresa."}</p>
    {step === 0 ? <div className="contact-grid">{fields.map(field => <div key={field.key}><label className="field-label" htmlFor={field.key}>{field.label}</label><Input className="lead-input" id={field.key} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} maxLength={field.maxLength} value={contact[field.key]} onChange={e => setContact({ ...contact, [field.key]: e.target.value })} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}/>{errors[field.key] && <p className="field-error" id={`${field.key}-error`}>{errors[field.key]}</p>}</div>)}</div>
      : question && <div className="option-list" role="radiogroup" aria-label={question.title}>{question.options.map((option, i) => <label className="option-row" key={option}><input type="radio" name={question.key} value={i} checked={answers[question.key] === i} onChange={() => { setAnswers({ ...answers, [question.key]: i }); setErrors({}); }}/><span>{option}</span></label>)}</div>}
    {errors["selection"] && <p className="field-error" role="alert">{errors["selection"]}</p>}
    {step === 4 && <label className="consent-row"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Concordo com a <a href="https://agenciascase.com.br/formulario-oticas/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a> e autorizo a Scase a entrar em contato comigo sobre marketing.</span></label>}
    {errors["consent"] && <p className="field-error" role="alert">{errors["consent"]}</p>}
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" maxLength={200}/></div>
    {errors["submit"] && <p className="submit-error" role="alert">{errors["submit"]}</p>}
    <div className="form-actions">{step > 0 && <Button type="button" variant="ghost" className="back-button" onClick={() => move(step - 1)} disabled={busy}><ArrowLeft/>Voltar</Button>}<Button type="submit" className="next-button" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin"/>Enviando...</> : <>{step === 4 ? "Quero aumentar minhas vendas" : "Continuar"}<ArrowRight/></>}</Button></div>
    <p className="privacy-note">Seus dados estão seguros e serão usados apenas para conversar<br className="hidden sm:block"/> com você sobre marketing. <a href="https://agenciascase.com.br/formulario-oticas/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a></p>
  </form>;
}