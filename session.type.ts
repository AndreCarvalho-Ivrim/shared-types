export type SessionType = {
  count: number,
  data: Session[]
}

export interface Session {
  id: string;
  session_start_date: Date;
  last_access: Date;
  active: boolean;
  user_id: string;
  ip: string;
  device: string;
  city?: string;
  state?: string;
  country?: string;
  created_at: Date;
  updated_at?: Date;
}