import { ArrowLeftIcon, ArrowDownLeftIcon } from '@phosphor-icons/react';
import { site } from '../content';
import { BusinessImage } from './BusinessImage';

export function Hero() {
  return (
    <section id="home" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span />
          בית לרהיטים. משפחה מאז 1980.
        </p>
        <h1 id="hero-title">{site.heroTitle}</h1>
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
          alt="רהיטים באולם התצוגה של רהיטי אולימפיק"
          width={1200}
          height={1600}
          eager
        />
      </figure>
    </section>
  );
}
