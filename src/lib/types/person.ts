export interface Person {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  date_of_birth: Date | null;
  created_at: Date;
  updated_at: Date;
}
