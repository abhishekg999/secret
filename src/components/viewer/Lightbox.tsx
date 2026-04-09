import { useEffect } from "react";
import { X } from "lucide-react";

type LightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

const Lightbox = ({ src, alt, onClose }: LightboxProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;
