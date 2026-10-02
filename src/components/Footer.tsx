import { MapPinIcon, PhoneIcon } from '@phosphor-icons/react';
import { site } from '../content';
import { externalLink, phoneHref } from './ContactLinks';

export function Footer() {
  return (
    <>
      <footer className="shell footer">
        <div>
          <strong>{site.name}</strong>
          <span>{site.address}</span>
        </div>
        <div className="footer-links">
          <a href={site.facebookUrl} {...externalLink}>
            פייסבוק
          </a>
          <a
            className="editor-link"
            href="https://app.pagescms.org/"
            {...externalLink}
          >
            עריכת האתר
          </a>
        </div>
      </footer>
      <nav className="mobile-contact" aria-label="קיצורי דרך ליצירת קשר">
        <a href={phoneHref}>
          <PhoneIcon size={21} aria-hidden />
          שיחה עם החנות
        </a>
        <a href={site.wazeUrl} {...externalLink}>
          <MapPinIcon size={21} aria-hidden />
          ניווט לחנות
        </a>
      </nav>
    </>
  );
}
