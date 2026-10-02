import { useState, useSyncExternalStore } from "react";
import {
  ArrowUpLeftIcon,
  PlusIcon,
  PhoneIcon,
  DoorOpenIcon,
  BedIcon,
  ArmchairIcon,
  TableIcon,
  MoonIcon,
  OfficeChairIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { categories, type CategoryId, type Product } from "../content";
import { BusinessImage } from "./BusinessImage";
import { ImageDialog } from "./ImageDialog";
import { phoneHref } from "./ContactLinks";

const categoryIcons = {
  wardrobes: DoorOpenIcon,
  bedrooms: BedIcon,
  sofas: ArmchairIcon,
  dining: TableIcon,
  mattresses: MoonIcon,
  office: OfficeChairIcon,
};

const desktopQuery = "(min-width: 1024px)";
const tabletQuery = "(min-width: 768px)";

function getGalleryColumns() {
  if (typeof window === "undefined" || !window.matchMedia) return 4;
  if (window.matchMedia(desktopQuery).matches) return 4;
  return window.matchMedia(tabletQuery).matches ? 2 : 1;
}

function subscribeToGalleryColumns(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const queries = [desktopQuery, tabletQuery].map((query) =>
    window.matchMedia(query),
  );
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => {
    queries.forEach((query) => query.removeEventListener("change", onChange));
  };
}

export function FurnitureGallery({ items }: { items: Product[] }) {
  const [category, setCategory] = useState<CategoryId>("wardrobes");
  const [selected, setSelected] = useState<Product | null>(null);
  const [pageStart, setPageStart] = useState(0);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const columns = useSyncExternalStore(
    subscribeToGalleryColumns,
    getGalleryColumns,
    () => 4,
  );
  const pageSize = columns * 2;
  const visible = items.filter(
    (item) => item.published && item.category === category,
  );
  const pageCount = Math.ceil(visible.length / pageSize);
  const page = Math.min(
    Math.floor(pageStart / pageSize),
    Math.max(0, pageCount - 1),
  );
  const pageItems = visible.slice(page * pageSize, (page + 1) * pageSize);
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
              onClick={(event) => {
                setKeyboardNavigation(event.detail === 0);
                setCategory(item.id);
                setSelected(null);
                setPageStart(0);
              }}
            >
              <Icon size={20} aria-hidden />
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status" aria-atomic="true">
        {current.label}: {visible.length} תמונות
        {visible.length > 0 && `, עמוד ${page + 1} מתוך ${pageCount}`}
      </p>
      {visible.length ? (
        <div
          key={`${category}-${page}-${columns}`}
          id="furniture-grid"
          className="gallery-grid"
          data-keyboard={keyboardNavigation}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {pageItems.map((product) => (
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
                  {product.priceFrom && "החל מ־"}
                  {new Intl.NumberFormat("he-IL", {
                    style: "currency",
                    currency: "ILS",
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
      {pageCount > 1 && (
        <nav className="gallery-pagination" aria-label="דפדוף בתמונות רהיטים">
          <button
            aria-label="העמוד הקודם"
            aria-controls="furniture-grid"
            disabled={page === 0}
            onClick={(event) => {
              setKeyboardNavigation(event.detail === 0);
              setPageStart((page - 1) * pageSize);
            }}
          >
            <CaretRightIcon size={24} aria-hidden />
          </button>
          <span className="gallery-page-count" aria-hidden="true">
            עמוד {page + 1} מתוך {pageCount}
          </span>
          <button
            aria-label="העמוד הבא"
            aria-controls="furniture-grid"
            disabled={page === pageCount - 1}
            onClick={(event) => {
              setKeyboardNavigation(event.detail === 0);
              setPageStart((page + 1) * pageSize);
            }}
          >
            <CaretLeftIcon size={24} aria-hidden />
          </button>
        </nav>
      )}
      {selected && (
        <ImageDialog product={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
