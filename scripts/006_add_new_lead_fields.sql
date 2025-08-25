-- Add new fields to leads table based on requirements
ALTER TABLE leads ADD COLUMN IF NOT EXISTS business_location TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS years_in_business INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS number_of_employees INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS number_of_branches INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS current_clients_per_month INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS average_ticket DECIMAL(10,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quantified_problem TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conservative_goal TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS known_competition TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS facebook_followers INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS other_achievements TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS specific_recognitions TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS high_season TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS critical_dates TEXT;

-- Add comments for clarity
COMMENT ON COLUMN leads.current_clients_per_month IS 'Number of clients served monthly - for ROI calculation';
COMMENT ON COLUMN leads.average_ticket IS 'Average sale amount per client - for ROI calculation';
COMMENT ON COLUMN leads.quantified_problem IS 'Problem description with specific numbers';
COMMENT ON COLUMN leads.conservative_goal IS 'Realistic and achievable goal';
COMMENT ON COLUMN leads.relationship_type IS 'Crucial for correspondence bias in quotations';
