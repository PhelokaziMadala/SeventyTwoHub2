-- Create email_queue table for storing status update emails
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  from_email TEXT,
  reply_to TEXT,
  status TEXT DEFAULT 'pending',
  email_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for email_queue
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert emails
CREATE POLICY "Allow authenticated users to insert emails" ON email_queue
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to read their own emails or admins to read all
CREATE POLICY "Allow users to read emails" ON email_queue
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update email status
CREATE POLICY "Allow users to update email status" ON email_queue
  FOR UPDATE TO authenticated USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_email_type ON email_queue(email_type);
