import GoldDivider from "./GoldDivider.jsx";

const TITLE_CLASS = {
  display: "section-heading__title section-heading__title--display",
  script: "section-heading__title section-heading__title--script",
  date: "section-heading__title section-heading__title--date",
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className = "",
  titleStyle = "display",
  withDivider = true,
}) {
  const titleClass = TITLE_CLASS[titleStyle] ?? TITLE_CLASS.display;

  return (
    <header className={`section-heading ${className}`.trim()} data-reveal>
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      {title && <h2 className={titleClass}>{title}</h2>}
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
      {withDivider && title && <GoldDivider className="section-heading__divider" />}
    </header>
  );
}
