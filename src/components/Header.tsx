import { useEffect, useRef, useState } from "react";
import { ListIcon, PhoneIcon, XIcon } from "@phosphor-icons/react";
import { site } from "../content";
import { phoneHref } from "./ContactLinks";

const links = [
  { href: "#furniture", label: "הרהיטים שלנו" },
  { href: "#custom", label: "בהתאמה אישית" },
  { href: "#story", label: "הסיפור שלנו" },
  { href: "#visit", label: "בואו לבקר" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    function resized() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", resized);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", resized);
    };
  }, [open]);
  return (
    <header className="site-header" ref={header}>
      <div className="shell header-inner">
        <nav className="desktop-nav" aria-label="ניווט ראשי">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className="menu-toggle icon-button"
          ref={toggle}
          aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <XIcon size={25} /> : <ListIcon size={25} />}
        </button>
        <div className="header-actions">
          <a className="header-phone" href={phoneHref}>
            <PhoneIcon size={19} aria-hidden />
            <bdi>{site.phone}</bdi>
          </a>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="תפריט נייד"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
