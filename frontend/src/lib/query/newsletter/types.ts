export interface NewsletterListRef {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  is_default: boolean;
  subscriber_count: number;
  created_at: string;
}

export interface Subscriber {
  id: number;
  uuid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: 'pending' | 'confirmed' | 'unsubscribed' | 'bounced' | 'complained' | 'suppressed';
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  lists: NewsletterListRef[];
  created_at: string;
}

export interface SubscriberListResponse {
  data: Subscriber[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Campaign {
  id: number;
  uuid: string;
  name: string;
  subject: string;
  preview_text: string | null;
  html_body: string;
  plain_body: string | null;
  from_name: string | null;
  from_email: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at: string | null;
  sent_at: string | null;
  lists: NewsletterListRef[];
  created_at: string;
}

export interface CampaignListResponse {
  data: Campaign[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
