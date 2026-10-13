import { z } from "zod";

export const questions = [
  { key: "company_size", title: "Qual é o porte atual da sua distribuidora?", options: ["Pequena — atendemos até 100 clientes", "Média — atendemos de 101 a 500 clientes", "Grande — atendemos de 501 a 1.500 clientes", "Empresa de grande porte — atendemos mais de 1.500 clientes"] },
  { key: "acquisition_channel", title: "Como sua empresa conquista novos clientes atualmente?", options: ["Principalmente por indicações", "Por meio de vendedores externos e prospecção ativa", "Por redes sociais e canais digitais", "Por anúncios pagos no Google e Meta", "Com uma estratégia estruturada que combina diferentes canais"] },
  { key: "marketing_budget", title: "Quanto sua empresa investe mensalmente em marketing e publicidade?", options: ["Ainda não investimos", "Até R$ 2.000 por mês", "De R$ 2.001 a R$ 5.000 por mês", "De R$ 5.001 a R$ 10.000 por mês", "Acima de R$ 10.000 por mês"] },
  { key: "main_goal", title: "Qual é o principal objetivo da sua empresa para os próximos meses?", options: ["Conquistar novos clientes e aumentar as vendas", "Expandir para novas cidades e regiões", "Gerar mais oportunidades para a equipe comercial", "Melhorar os resultados dos anúncios atuais", "Expandir minha marca e fortalecer meu posicionamento no mercado"] },
] as const;

export const contactSchema = z.object({
  full_name: z.string().trim().min(3, "Informe seu nome completo.").max(100),
  company_name: z.string().trim().min(2, "Informe o nome da empresa.").max(150),
  email: z.string().trim().email("Informe um e-mail válido.").max(255),
  phone: z.string().trim().transform(v => v.replace(/\D/g, "")).pipe(z.string().regex(/^\d{10,13}$/, "Informe um telefone com DDD válido.")),
});
export const leadSchema = contactSchema.extend({
  submission_id: z.string().uuid(),
  company_size: z.number().int().min(0).max(3),
  acquisition_channel: z.number().int().min(0).max(4),
  marketing_budget: z.number().int().min(0).max(4),
  main_goal: z.number().int().min(0).max(4),
  consent: z.literal(true),
  website: z.string().max(0),
});