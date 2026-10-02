import { useState, useSyncExternalStore } from "react";
import {
  ArrowLeftIcon,
  PauseIcon,
  PlayIcon,
  ArrowUpLeftIcon,
  ArrowDownIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { products, site, type Product } from "../content";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FurnitureGallery } from "../components/FurnitureGallery";
import { Visit } from "../components/Visit";
import { BusinessImage } from "../components/BusinessImage";
import { ImageDialog } from "../components/ImageDialog";
import { phoneHref } from "../components/ContactLinks";
import { RoomComposer } from "./RoomComposer";
import { usePageMotion } from "./usePageMotion";
import { WoodHeadline } from "./WoodHeadline";

const featuredIds = new Set([
  "facebook-832837595530444",
  "facebook-832837322197138",
  "facebook-876564394491097",
  "facebook-669404728540399",
  "facebook-839128558234681",
  "facebook-832837258863811",
]);
const featured = products.filter((product) => featuredIds.has(product.id));
const motionQuery = "(prefers-reduced-motion: reduce)";
function getReducedMotion() {
  return (
    typeof window !== "undefined" && !!window.matchMedia?.(motionQuery).matches
  );
}
function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia?.(motionQuery);
  query?.addEventListener("change", onChange);
  return () => query?.removeEventListener("change", onChange);
}
export function WoodPreview({ preview = false }: { preview?: boolean }) {
  const { root, progress } = usePageMotion();
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const reduce = useSyncExternalStore(
    subscribeToMotion,
    getReducedMotion,
    () => true,
  );
  const motion = reduce ? "off" : "playing";
  return (
    <div
      className={`wood-preview${preview ? " is-preview" : ""}`}
      data-motion={motion}
      ref={root}
    >
      <a className="skip-link" href="#main">
        דילוג לתוכן הראשי
      </a>
      {preview && (
        <div className="wood-preview-toolbar">
          <div className="shell wood-preview-toolbar-inner">
            <span>תצוגת עיצוב חדשה</span>
            <div>
              <a href="/">
                לאתר הנוכחי
                <ArrowUpLeftIcon size={16} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      )}
      <Header />
      <div className="wood-scroll-progress" aria-hidden="true" ref={progress} />
      <main id="main" tabIndex={-1}>
        <section
          id="home"
          className="wood-hero shell"
          aria-labelledby="wood-hero-title"
        >
          <div className="wood-hero-copy">
            <WoodHeadline title={site.heroTitle} />
            <p>{site.heroDescription}</p>
            <div className="wood-hero-actions">
              <a className="button primary" href="#furniture">
                לצפייה ברהיטים
                <ArrowLeftIcon size={20} aria-hidden />
              </a>
              <a className="text-link" href="#visit">
                בואו לבקר בחנות
                <ArrowUpLeftIcon size={19} aria-hidden />
              </a>
            </div>
          </div>
          <RoomComposer motion={motion} />
          <a href="#wood-showcase" className="wood-scroll-link">
            גללו, ותרגישו בבית
            <ArrowDownIcon size={17} aria-hidden />
          </a>
        </section>
        <section
          id="wood-showcase"
          className="wood-showcase"
          aria-labelledby="wood-showcase-title"
        >
          <div className="shell wood-showcase-heading">
            <h2 id="wood-showcase-title">
              רהיטים עם אופי.
              <br />
              <span>מקום לכל מה שאוהבים.</span>
            </h2>
            <p>
              מפרטים קטנים ועד הרהיט שמחבר את כל החדר. כמה רגעים מתוך המבחר
              שלנו.
            </p>
          </div>
          <div
            className="wood-photo-strip"
            data-paused={carouselPaused}
            role="region"
            aria-label="תמונות נבחרות מהחנות"
          >
            <div className="wood-strip-track" dir="ltr">
              <div className="wood-strip-group">
                {featured.map((product) => (
                  <button
                    key={product.id}
                    className="wood-strip-photo"
                    aria-label={`הגדלת תמונה: ${product.title}`}
                    onClick={() => setSelected(product)}
                  >
                    <BusinessImage src={product.image} alt={product.title} />
                    <span dir="rtl">{product.title}</span>
                  </button>
                ))}
              </div>
              <div
                className="wood-strip-group wood-strip-copy"
                aria-hidden="true"
              >
                {featured.map((product) => (
                  <button
                    key={product.id}
                    className="wood-strip-photo"
                    tabIndex={-1}
                    onClick={() => setSelected(product)}
                  >
                    <BusinessImage src={product.image} alt="" />
                    <span dir="rtl">{product.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="shell wood-showcase-bottom">
            <div className="wood-showcase-caption">
              <span>צילום אמיתי מהחנות. לחצו כדי לראות מקרוב.</span>
              {!reduce && (
                <button
                  className="wood-carousel-control"
                  aria-pressed={carouselPaused}
                  onClick={() => setCarouselPaused((value) => !value)}
                >
                  {carouselPaused ? (
                    <PlayIcon size={17} aria-hidden />
                  ) : (
                    <PauseIcon size={17} aria-hidden />
                  )}
                  {carouselPaused ? "הפעלת התמונות" : "עצירת התמונות"}
                </button>
              )}
            </div>
            <a className="text-link" href="#furniture">
              לכל הרהיטים
              <ArrowLeftIcon size={19} aria-hidden />
            </a>
          </div>
        </section>
        <FurnitureGallery items={products} />
        <section
          id="custom"
          className="wood-custom"
          aria-labelledby="wood-custom-title"
        >
          <div className="shell wood-custom-layout">
            <div className="wood-custom-copy">
              <h2 id="wood-custom-title">{site.customTitle}</h2>
              <p>{site.customDescription}</p>
              <div className="wood-options">
                {site.customOptions.map((option, index) => (
                  <details key={option.title} open={index === 0}>
                    <summary>
                      {option.title}
                      <PlusIcon size={20} aria-hidden />
                    </summary>
                    <p>{option.description}</p>
                  </details>
                ))}
              </div>
              <a className="text-link" href={phoneHref}>
                נדבר על הרעיון שלכם
                <ArrowLeftIcon size={20} aria-hidden />
              </a>
            </div>
            <figure className="wood-custom-photo">
              <BusinessImage
                src="/images/facebook-832837595530444.webp"
                alt="מזנון בגוון עץ עם חזיתות פסים, מתוך החנות"
              />
              <figcaption>הפרטים הקטנים שעושים את ההבדל.</figcaption>
            </figure>
          </div>
        </section>
        <section
          id="story"
          className="wood-story"
          aria-labelledby="wood-story-title"
        >
          <div className="shell wood-story-layout">
            <div className="wood-story-copy">
              <h2 id="wood-story-title">{site.storyTitle}</h2>
              {site.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <figure>
              <BusinessImage
                src={site.storyImage}
                alt={site.founders}
                width={1512}
                height={1006}
              />
              <figcaption>{site.founders}, מייסדי רהיטי אולימפיק</figcaption>
            </figure>
          </div>
        </section>
        <Visit />
      </main>
      <div className="shell wood-logo-signature">
        <img
          src="/images/brand/logo-wood-letters.webp"
          alt={site.name}
          width={140}
          height={140}
          loading="lazy"
        />
        <p>
          רהיטים לבית שלכם.
          <br />
          עסק משפחתי מאז 1980.
        </p>
      </div>
      <Footer />
      {selected && (
        <ImageDialog product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
