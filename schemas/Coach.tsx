export default interface Coach {
  firebase_id: string;
  email: string;
  avatar_url?: string | null;
  access?: string;
  birth_date?: Date | null;
  phone?: string | null;
  nationality?: string | null;
  display_name?: string | null;
}

