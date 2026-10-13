import { describe, expect, it } from "vitest";
import { contactSchema, leadSchema, questions } from "../lib/lead-schema";

const valid = { full_name: "Ana Silva", company_name: "Distribuidora Teste", email: "ana@example.com", phone: "(11) 99999-8888", company_size: 0, acquisition_channel: 0, marketing_budget: 0, main_goal: 0, consent: true, submission_id: "123e4567-e89b-42d3-a456-426614174000", website: "" };
describe("Lead qualification", () => {
  it("accepts four company sizes only", () => {
    expect(questions[0].options).toEqual(["Pequena — atendemos até 100 clientes", "Média — atendemos de 101 a 500 clientes", "Grande — atendemos de 501 a 1.500 clientes", "Empresa de grande porte — atendemos mais de 1.500 clientes"]);
    expect(leadSchema.safeParse({ ...valid, company_size: 3 }).success).toBe(true);
    expect(leadSchema.safeParse({ ...valid, company_size: 4 }).success).toBe(false);
  });
  it("accepts the five specified monthly budget bands only", () => {
    expect(questions[2].options).toEqual(["Ainda não investimos", "Até R$ 2.000 por mês", "De R$ 2.001 a R$ 5.000 por mês", "De R$ 5.001 a R$ 10.000 por mês", "Acima de R$ 10.000 por mês"]);
    expect(leadSchema.safeParse({ ...valid, marketing_budget: 4 }).success).toBe(true);
    expect(leadSchema.safeParse({ ...valid, marketing_budget: 5 }).success).toBe(false);
  });
  it("requires all four qualifications", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
    for (const key of ["company_size", "acquisition_channel", "marketing_budget", "main_goal"]) expect(leadSchema.safeParse({ ...valid, [key]: undefined }).success).toBe(false);
  });
  it("validates contact details and normalizes WhatsApp", () => {
    expect(contactSchema.parse(valid).phone).toBe("11999998888");
    expect(contactSchema.safeParse({ ...valid, email: "invalid" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });
  it("requires consent and rejects honeypot submissions", () => {
    expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });
});