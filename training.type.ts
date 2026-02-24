export type TrainingPermissionMode = 'all-hub' | 'selected-clients';
export interface TrainingType{
  _id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  key_words: string[];
  wallpaper: string;
  visits: number;
  permissions?: {
    mode: TrainingPermissionMode,
    allowed: string[]
  },
  created_at: Date;
  updated_at: Date;
}