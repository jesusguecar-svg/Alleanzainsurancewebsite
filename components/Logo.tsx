export function Logo({ light = false }: { light?: boolean }) {
  const ink = light ? "#ffffff" : "#061431";
  return (
    <div className="flex items-center gap-3" aria-label="Alleanza Insurance">
      <svg width="39" height="48" viewBox="0 0 39 48" fill="none" aria-hidden="true">
        <path d="M3 7C13 8 19 13 20 23C11 22 5 17 3 7Z" fill="#04c0fe" />
        <path d="M36 3C24 7 18 15 20 28C31 24 36 16 36 3Z" fill={ink} />
        <path d="M7 25C13 27 18 32 19 43C10 39 6 33 7 25Z" fill="#04c0fe" opacity=".7" />
      </svg>
      <div className="leading-none"><div className="text-[17px] font-extrabold tracking-[.22em]" style={{ color: ink }}>ALLEANZA</div><div className="mt-1 text-[9px] font-bold tracking-[.42em] text-cyan">INSURANCE</div></div>
    </div>
  );
}
