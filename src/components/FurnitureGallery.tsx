import { useState } from 'react';
import {
  ArrowUpLeftIcon,
  PlusIcon,
  PhoneIcon,
  DoorOpenIcon,
  BedIcon,
  BabyIcon,
  ArmchairIcon,
  TableIcon,
  MoonIcon,
  OfficeChairIcon,
} from '@phosphor-icons/react';
import { categories, type CategoryId, type Product } from '../content';
import { BusinessImage } from './BusinessImage';
import { ImageDialog } from './ImageDialog';
import { phoneHref } from './ContactLinks';

const categoryIcons = {
  wardrobes: DoorOpenIcon,
  bedrooms: BedIcon,
  children: BabyIcon,
  sofas: ArmchairIcon,
  dining: TableIcon,
  mattresses: MoonIcon,
  office: OfficeChairIcon,
};

export function FurnitureGallery({ items }: { items: Product[] }) {
  const [category, setCategory] = useState<CategoryId>('wardrobes');
  const [selected, setSelected] = useState<Product | null>(null);
  const visible = items.filter(
    (item) => item.published && item.category === category,
  );
  const current = categories.find((item) => item.id === category)!;
  return (
    <section
      id="furniture"
      className="section shell furniture"
      aria-labelledby="furniture-title"
    >
      <h2 id="furniture-title">לכל חדר, לכל יום.</h2>
      <p className="section-intro">
        הצצה לרהיטים שלנו. בחרו חדר והתחילו לדמיין את הבית שלכם.
      </p>
      <div
        className="category-filters"
        role="group"
        aria-label="סינון רהיטים לפי קטגוריה"
      >
        {categories.map((item) => {
          const Icon = categoryIcons[item.id];
          return (
            <button
              key={item.id}
              aria-pressed={category === item.id}
              onClick={() => {
                setCategory(item.id);
                setSelected(null);
              }}
            >
              <Icon size={20} aria-hidden />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="gallery-description">
        <h3>{current.label}</h3>
        <p>{current.description}</p>
      </div>
      <p className="sr-only" role="status">
        {current.label}: {visible.length} תמונות
      </p>
      {visible.length ? (
        <div className="gallery-grid">
          {visible.map((product) => (
            <article key={product.id} className="furniture-item">
              <button
                className="furniture-image"
                aria-label={`הגדלת תמונה: ${product.title}`}
                onClick={() => setSelected(product)}
              >
                <BusinessImage src={product.image} alt={product.title} />
                <span className="enlarge-icon">
                  <PlusIcon size={23} aria-hidden />
                </span>
              </button>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              {product.price !== undefined && (
                <p className="product-price">
                  {product.priceFrom && 'החל מ־'}
                  {new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS',
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-category">
          <ArrowUpLeftIcon size={32} aria-hidden />
          <h4>מחפשים {current.label}?</h4>
          <p>
            עוד אין כאן תמונות מהקטגוריה הזו. נשמח לשמוע מה אתם מחפשים ולספר על
            האפשרויות בחנות.
          </p>
          <a className="button primary" href={phoneHref}>
            <PhoneIcon size={20} aria-hidden />
            דברו איתנו
          </a>
        </div>
      )}
      <p className="gallery-note">
        התמונות מציגות דוגמאות לרהיטים. לפרטים ולבירור זמינות, דברו איתנו.
      </p>
      {selected && (
        <ImageDialog product={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
