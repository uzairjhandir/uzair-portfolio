export interface NewsletterRecord {
  id: string;
  email: string;
  status: "subscribed" | "unsubscribed" | "bounced";
  subscribed_at?: string;
  created_at?: string;
  updated_at?: string;
}
