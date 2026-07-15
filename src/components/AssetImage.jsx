export default function AssetImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  ...rest
}) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
