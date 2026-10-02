import { products } from './content';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FurnitureGallery } from './components/FurnitureGallery';
import { CustomFurniture } from './components/CustomFurniture';
import { FamilyStory } from './components/FamilyStory';
import { Visit } from './components/Visit';
import { Footer } from './components/Footer';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        דילוג לתוכן הראשי
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <FurnitureGallery items={products} />
        <CustomFurniture />
        <FamilyStory />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
