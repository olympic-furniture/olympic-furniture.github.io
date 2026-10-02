import { Fragment } from "react";

function WoodenLetter({ letter }: { letter: "ר" | "ל" }) {
  const name = letter === "ר" ? "resh" : "lamed";
  return (
    <span className={`wood-letter wood-letter-${name}`} aria-hidden="true">
      <img
        className="wood-letter-piece"
        src={`/images/brand/letter-${name}.png`}
        alt=""
      />
    </span>
  );
}

/** Keep CMS copy intact; only the two approved words receive wooden initials. */
export function WoodHeadline({ title }: { title: string }) {
  const comma = title.indexOf(",");
  const lead = comma === -1 ? title : title.slice(0, comma + 1);
  const rest = comma === -1 ? "" : title.slice(comma + 1).trim();
  const words = lead.split(/(ריהוט|לבית)/);
  return (
    <h1 id="wood-hero-title" aria-label={title}>
      <span className="wood-headline-lead" aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={index}>
            {word === "ריהוט" || word === "לבית" ? (
              <>
                <WoodenLetter letter={word[0] as "ר" | "ל"} />
                {word.slice(1)}
              </>
            ) : (
              word
            )}
          </Fragment>
        ))}
      </span>
      {rest && (
        <>
          <br />
          <span className="wood-headline-rest" aria-hidden="true">
            {rest}
          </span>
        </>
      )}
    </h1>
  );
}
