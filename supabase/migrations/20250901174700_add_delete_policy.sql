-- Add DELETE policy for business_registrations table
-- This allows admins to delete duplicate registrations

CREATE POLICY "Admins can delete registrations"
  ON business_registrations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin', 'program_manager', 'client_admin')
    )
  );

-- Create admin function to delete registrations (bypasses RLS)
CREATE OR REPLACE FUNCTION delete_registration_admin(registration_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- Check if user has admin privileges
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = auth.uid()
  AND role IN ('admin', 'super_admin', 'program_manager', 'client_admin')
  LIMIT 1;

  IF user_role IS NULL THEN
    RAISE EXCEPTION 'Insufficient permissions to delete registrations';
  END IF;

  -- Delete the registration (this will cascade to related documents)
  DELETE FROM business_registrations WHERE id = registration_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error deleting registration: %', SQLERRM;
END;
$$;
