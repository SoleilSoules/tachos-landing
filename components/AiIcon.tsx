// Voice buttons carry the assistant mark (Гоша): same flat single-colour glyph
// language as the waveform it replaces, but the shape now reads as AI — a single
// four-point spark, centred. Fill is `currentColor`, so it inherits the button's
// black/white the way the old icon did.
//
// Each arm is one cubic whose control points sit near the centre — that pinch is
// what makes a spark instead of a hard diamond. Bigger pinch = fatter arms, which
// is how the weight was matched to the old filled glyph.
//
// It turns and breathes (see `.ai-spark` in globals.css): the wrapper spins, the
// glyph pulses, so the two motions compose without fighting over one transform.
export function AiIcon({ size = 48 }: { size?: number }) {
  return (
    <span className="ai-spark" style={{ width: size, height: size }} aria-hidden>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5C12 9.25 14.75 12 21.5 12C14.75 12 12 14.75 12 21.5C12 14.75 9.25 12 2.5 12C9.25 12 12 9.25 12 2.5Z" />
      </svg>
    </span>
  );
}
