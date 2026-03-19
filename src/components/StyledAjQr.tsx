import { useEffect, useRef } from "react";

type StyledAjQrProps = {
  size?: number;
  className?: string;
};

const AJ_SITE_URL = "https://www.ajstudioz.co.in/";

const StyledAjQr = ({ size = 120, className = "" }: StyledAjQrProps) => {
  const qrRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const renderQr = async () => {
      if (!qrRootRef.current) return;

      const { default: QRCodeStyling } = await import("qr-code-styling");

      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: "canvas",
        data: AJ_SITE_URL,
        margin: 0,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 4,
        },
        qrOptions: {
          errorCorrectionLevel: "H",
        },
        dotsOptions: {
          color: "#7B1B5E",
          type: "rounded",
        },
        cornersSquareOptions: {
          color: "#050505",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#050505",
          type: "dot",
        },
        backgroundOptions: {
          color: "#FFFFFF",
        },
      });

      qrRootRef.current.innerHTML = "";
      if (mounted && qrRootRef.current) {
        qrCode.append(qrRootRef.current);
      }
    };

    renderQr();

    return () => {
      mounted = false;
    };
  }, [size]);

  return <div ref={qrRootRef} className={className} aria-label="Styled AJ STUDIOZ QR code" />;
};

export default StyledAjQr;
