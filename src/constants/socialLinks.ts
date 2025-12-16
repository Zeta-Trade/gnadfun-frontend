import { Twitter, Youtube, Send } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SocialLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export const SOCIAL_LINKS = [
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    Icon: Twitter,
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    Icon: Youtube,
  },
  {
    href: 'https://t.me',
    label: 'Telegram',
    Icon: Send,
  },
];
