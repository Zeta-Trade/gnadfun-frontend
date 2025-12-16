import { Twitter } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface FooterProps {
  className?: string;
}
// const FOOTER_LINKS = [
  // { label: 'Home', href: '/' },
  // { label: 'Advanced', href: '/advanced' },
  // { label: 'Terms', href: '/terms' },
  // { label: 'Privacy', href: '/privacy' },
// ];

export function Footer({ className = '' }: FooterProps) {
  const t = useTranslation();
  return (
    <footer className={`border-t border-white/10 bg-black/20 backdrop-blur-lg ${className}`.trim()}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex flex-col">
            <p className="font-base-sm text-white/70">{t.footer.tagline}</p>
            <div className="flex items-center gap-2">
              <span className="font-base-sm text-white/70 font-semibold">{t.footer.followUs}</span>
              <div className="flex items-center gap-2 p-3 rounded-full ">
                {/* {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-white transition-colors"
                    aria-label={label}
                  >
                    <Icon className="size-4" />
                  </a>
                ))} */}
                <a href="https://x.com/gnadfun" target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-white transition-colors"
                  aria-label="Gnadfun Twitter">
                    <Twitter className="size-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* {FOOTER_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))} */}
            <span className="font-base-sm text-white/70">{t.footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
