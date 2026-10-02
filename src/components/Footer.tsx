import { site } from "../content";
import { externalLink } from "./ContactLinks";

export function Footer() {
  return (
    <footer className="shell footer">
      <div>
        <strong>{site.name}</strong>
        <span>{site.address}</span>
      </div>
      <div className="footer-links">
        <a href={site.facebookUrl} {...externalLink}>
          פייסבוק
        </a>
      </div>
    </footer>
  );
}
