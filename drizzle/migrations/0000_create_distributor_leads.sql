CREATE TABLE public.distributor_leads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 submission_id uuid NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now(),
 full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 3 AND 100),
 company_name text NOT NULL CHECK (char_length(company_name) BETWEEN 2 AND 150),
 email text NOT NULL CHECK (char_length(email) <= 255 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text NOT NULL CHECK (phone ~ '^[0-9]{10,13}$'),
 company_size smallint NOT NULL CHECK (company_size BETWEEN 0 AND 3),
 acquisition_channel smallint NOT NULL CHECK (acquisition_channel BETWEEN 0 AND 4),
 marketing_budget smallint NOT NULL CHECK (marketing_budget BETWEEN 0 AND 4),
 main_goal smallint NOT NULL CHECK (main_goal BETWEEN 0 AND 4),
 consent boolean NOT NULL CHECK (consent = true)
);
GRANT INSERT ON public.distributor_leads TO anon;
GRANT ALL ON public.distributor_leads TO service_role;
ALTER TABLE public.distributor_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors may submit qualified leads" ON public.distributor_leads FOR INSERT TO anon WITH CHECK (consent = true);
COMMENT ON TABLE public.distributor_leads IS 'Private Scase food distributor lead submissions; no visitor read access.';