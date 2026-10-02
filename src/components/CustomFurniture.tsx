import {
  ArrowLeftIcon,
  RulerIcon,
  PaletteIcon,
  DoorOpenIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react';
import { site } from '../content';
import { phoneHref } from './ContactLinks';

export function CustomFurniture() {
  const icons = [RulerIcon, PaletteIcon, DoorOpenIcon, SquaresFourIcon];
  return (
    <section
      id="custom"
      className="custom-section"
      aria-labelledby="custom-title"
    >
      <div className="shell section">
        <div className="custom-heading">
          <p className="eyebrow">ריהוט בהתאמה אישית</p>
          <h2 id="custom-title">{site.customTitle}</h2>
          <p className="section-intro">{site.customDescription}</p>
        </div>
        <div className="custom-options">
          {site.customOptions.map((option, index) => {
            const Icon = icons[index] ?? SquaresFourIcon;
            return (
              <div key={option.title}>
                <span className="option-icon">
                  <Icon size={29} aria-hidden />
                </span>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>
            );
          })}
        </div>
        <a className="text-link" href={phoneHref}>
          בואו נדבר על הרהיט שלכם
          <ArrowLeftIcon size={21} aria-hidden />
        </a>
      </div>
    </section>
  );
}
