import { useEffect } from "react";
import { X } from "lucide-react";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const Lightbox = ({ src, alt, onClose }: LightboxProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-content-muted transition-colors hover:text-content"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default Lightbox;
