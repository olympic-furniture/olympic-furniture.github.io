import { ArrowLeftIcon, ArrowDownLeftIcon } from '@phosphor-icons/react';
import { site } from '../content';
import { BusinessImage } from './BusinessImage';

export function Hero() {
  const breakAt = site.heroTitle.indexOf(',');
  return (
    <section id="home" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          {breakAt >= 0 ? (
            <>
              {site.heroTitle.slice(0, breakAt + 1)}{' '}
              <span className="hero-highlight">
                {site.heroTitle.slice(breakAt + 1).trim()}
              </span>
            </>
          ) : (
            site.heroTitle
          )}
        </h1>
        <p className="hero-description">{site.heroDescription}</p>
        <div className="hero-actions">
          <a className="button primary" href="#furniture">
            לצפייה ברהיטים
            <ArrowLeftIcon size={21} aria-hidden />
          </a>
          <a className="text-link" href="#visit">
            בואו לבקר בחנות
            <ArrowDownLeftIcon size={20} aria-hidden />
          </a>
        </div>
      </div>
      <figure className="hero-figure">
        <BusinessImage
          src={site.heroImage}
          alt={site.name}
          width={1247}
          height={476}
          eager
        />
      </figure>
    </section>
  );
}
