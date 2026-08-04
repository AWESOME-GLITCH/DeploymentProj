export function Logo({ size = 36 }: { size?: number }) {
  // Approximation of the ES World "es" monogram in a rounded tile.
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-glow shadow-glow"
      style={{ width: size, height: size }}
    >
      <span
        className="font-bold lowercase leading-none text-white"
        style={{ fontSize: size * 0.5, letterSpacing: "-0.04em" }}
      >
        es
      </span>
    </div>
  );
}
