export default function SectionFrame({
  id,
  className = "",
  size = "normal",
  bleed = false,
  children,
}) {
  return (
    <section
      id={id}
      className={`section section--${size}${bleed ? " section--bleed" : ""} ${className}`.trim()}
    >
      {bleed ? children : <div className="section-inner">{children}</div>}
    </section>
  );
}
