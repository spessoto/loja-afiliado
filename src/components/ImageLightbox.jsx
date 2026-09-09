import { useEffect } from "react";

const iconBtnStyle = { width: 46, height: 46, borderRadius: "50%", border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

export default function ImageLightbox({ images, index, onIndexChange, onClose, alt }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onIndexChange, onClose]);

  if (!images.length) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(1,10,20,.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <button onClick={onClose} aria-label="Fechar" style={{ ...iconBtnStyle, position: "absolute", top: 20, right: 20 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onIndexChange((index - 1 + images.length) % images.length); }}
          aria-label="Imagem anterior"
          style={{ ...iconBtnStyle, position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
        </button>
      )}

      <img src={images[index]} alt={alt} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 8, cursor: "default" }} />

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onIndexChange((index + 1) % images.length); }}
          aria-label="Próxima imagem"
          style={{ ...iconBtnStyle, position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
        </button>
      )}

      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "#fff", font: "500 13px Inter", background: "rgba(255,255,255,.1)", padding: "6px 14px", borderRadius: 20 }}>
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
