interface QRCodeProps {
  url: string;
  size?: number;
  fgColor?: string;
  className?: string;
}

/**
 * Generates the QR image via the free qrserver.com API. This keeps the
 * project dependency-free, but it does mean QR rendering needs internet
 * access. If you want fully offline QR generation, swap this for the
 * `qrcode` npm package and render to a <canvas> instead — the rest of the
 * app doesn't care how the image is produced.
 */
export function qrImageSrc(url: string, size = 240, fgColor = "1B211F") {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: url,
    color: fgColor.replace("#", ""),
    margin: "8",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

export default function QRCode({ url, size = 160, fgColor = "1B211F", className }: QRCodeProps) {
  const src = qrImageSrc(url, size * 2, fgColor);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={size}
      height={size}
      alt={`QR code linking to ${url}`}
      className={className}
    />
  );
}
