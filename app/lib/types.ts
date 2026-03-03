export interface Comment {
  id: number;
  slug: string;
  name: string;
  email: string;
  body: string;
  created_at: string;
  parent_id?: number | null;
  notify_replies?: boolean;
}
