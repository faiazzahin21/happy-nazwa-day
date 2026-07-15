import AssetImage from "./AssetImage.jsx";

export default function DecorImage({
  src,
  className = "",
  loading = "lazy",
  decoding = "async",
  ...rest
}) {
  return (
    <AssetImage
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
