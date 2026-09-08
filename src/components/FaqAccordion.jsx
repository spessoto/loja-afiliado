export default function FaqAccordion({ faq, qFont = "700 15.5px Montserrat" }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {faq.map((f, i) => (
        <details key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff", padding: "18px 20px" }}>
          <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, font: qFont, color: "#012746" }}>
            {f.q}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2.4" strokeLinecap="round" style={{ flex: "none" }}><path d="M12 5.5v13M5.5 12h13"></path></svg>
          </summary>
          <p style={{ margin: "12px 0 0", font: "400 14.5px/1.65 Inter", color: "#475569" }}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
