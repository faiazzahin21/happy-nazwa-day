export default function SoftGlow({ className = "", style, ...rest }) {
  return (
    <div
      className={`soft-glow ${className}`.trim()}
      aria-hidden="true"
      style={{
        width: "220px",
        height: "220px",
        top: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        ...style,
      }}
      {...rest}
    />
  );
}
