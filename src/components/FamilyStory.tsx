import { site } from '../content';
import { BusinessImage } from './BusinessImage';

export function FamilyStory() {
  return (
    <section
      id="story"
      className="section shell family-story"
      aria-labelledby="story-title"
    >
      <figure>
        <BusinessImage
          src={site.storyImage}
          alt={site.founders}
          width={1512}
          height={1006}
        />
        <figcaption>{site.founders}, מייסדי רהיטי אולימפיק</figcaption>
      </figure>
      <div className="story-copy">
        <h2 id="story-title">{site.storyTitle}</h2>
        {site.storyParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <span className="story-signature">
          רהיטי אולימפיק · עסק משפחתי בנתניה
        </span>
      </div>
    </section>
  );
}
