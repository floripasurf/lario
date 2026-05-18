-- Add email and verification flags to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verification_token TEXT;

-- Unique constraints for anti-fraud
ALTER TABLE profiles ADD CONSTRAINT profiles_phone_unique UNIQUE (phone);
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_creci_unique
  ON profiles (creci_number) WHERE creci_number IS NOT NULL;

-- Lead tracking (WhatsApp clicks)
CREATE TABLE lead_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX idx_lead_clicks_listing ON lead_clicks (listing_id);
CREATE INDEX idx_lead_clicks_date ON lead_clicks (clicked_at);

-- RLS for lead_clicks
ALTER TABLE lead_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a click (public action)
CREATE POLICY "Anyone can log a lead click"
  ON lead_clicks FOR INSERT WITH CHECK (true);

-- Listing owners can view their own leads
CREATE POLICY "Owners can view lead clicks"
  ON lead_clicks FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM listings WHERE owner_id = auth.uid()
    )
  );

-- Service role can read all
CREATE POLICY "Service role full access to lead_clicks"
  ON lead_clicks FOR ALL USING (auth.role() = 'service_role');

-- View for aggregated lead counts per listing
CREATE OR REPLACE VIEW listing_lead_counts AS
SELECT
  listing_id,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE clicked_at > NOW() - INTERVAL '30 days') AS leads_30d,
  COUNT(*) FILTER (WHERE clicked_at > NOW() - INTERVAL '7 days') AS leads_7d
FROM lead_clicks
GROUP BY listing_id;
