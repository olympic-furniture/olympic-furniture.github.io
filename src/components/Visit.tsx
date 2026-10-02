import { ArrowUpLeftIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react';
import { site } from '../content';
import { BusinessImage } from './BusinessImage';
import { externalLink, phoneHref, whatsappHref } from './ContactLinks';

export function Visit() {
  return (
    <section id="visit" className="visit-section" aria-labelledby="visit-title">
      <div className="shell section">
        <h2 id="visit-title">בואו למצוא את הרהיט שלכם.</h2>
        <p className="section-intro">
          לראות מקרוב, להרגיש את החומרים ולדבר על מה שמתאים לכם.
        </p>
        <div className="visit-layout">
          <div className="visit-details">
            <div>
              <MapPinIcon size={26} aria-hidden />
              <h3>נפגשים בחנות</h3>
              <address>{site.address}</address>
              <div className="map-links">
                <a href={site.mapsUrl} {...externalLink}>
                  Google Maps
                  <ArrowUpLeftIcon size={19} aria-hidden />
                </a>
                <a href={site.wazeUrl} {...externalLink}>
                  Waze
                  <ArrowUpLeftIcon size={19} aria-hidden />
                </a>
              </div>
            </div>
            <div>
              <PhoneIcon size={26} aria-hidden />
              <h3>נשמח לדבר איתכם</h3>
              <a className="visit-phone" href={phoneHref}>
                <bdi>{site.phone}</bdi>
              </a>
              <p>מומלץ להתקשר לפני שמגיעים.</p>
              {site.hoursText && <p className="hours">{site.hoursText}</p>}
              {site.email && (
                <a className="optional-contact" href={`mailto:${site.email}`}>
                  <bdi>{site.email}</bdi>
                </a>
              )}
              {site.whatsapp && (
                <a
                  className="optional-contact"
                  href={whatsappHref(site.whatsapp)}
                  {...externalLink}
                >
                  דברו איתנו ב־WhatsApp
                </a>
              )}
            </div>
          </div>
          <figure className="visit-photo">
            <BusinessImage
              src="/images/storefront.webp"
              alt="חזית חנות רהיטי אולימפיק בנתניה"
              width={600}
              height={338}
            />
            <figcaption>
              {site.name} · {site.address}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
