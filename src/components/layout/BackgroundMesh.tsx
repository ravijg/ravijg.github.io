/** Fixed gradient mesh behind all content. Pure CSS; drifts on md+ only (static on phones to save battery). */
export function BackgroundMesh() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] size-[50vmax] md:animate-[drift_28s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(124,247,255,.07),transparent_60%)]" />
      <div className="absolute top-[40%] right-[-15%] size-[55vmax] md:animate-[drift_34s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(139,123,255,.08),transparent_60%)]" />
      <div className="absolute bottom-[-20%] left-[20%] size-[45vmax] md:animate-[drift_40s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,122,217,.05),transparent_60%)]" />
      <style>{`@keyframes drift{0%,100%{transform:translate3d(0,0,0) scale(1)}33%{transform:translate3d(6vw,-4vh,0) scale(1.08)}66%{transform:translate3d(-4vw,5vh,0) scale(.95)}}`}</style>
    </div>
  );
}
