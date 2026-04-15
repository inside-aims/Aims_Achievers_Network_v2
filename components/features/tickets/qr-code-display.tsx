"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

// Client-side QR code generator that renders as an image
const QRCodeDisplay = ({ value, size = 180, className = "" }: QRCodeDisplayProps) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setError(true));
  }, [value, size]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <p className="text-xs text-muted-foreground text-center px-2">
          QR code unavailable
        </p>
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div
        className={`skeleton rounded-lg ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt={`QR code for ${value}`}
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
    />
  );
};

export default QRCodeDisplay;
