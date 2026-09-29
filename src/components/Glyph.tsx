type GlyphKind = 'letter' | 'compass' | 'key' | 'light';

export default function Glyph({ kind }: { kind: GlyphKind }) {
  return (
    <svg className="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      {kind === 'letter' && <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7M3 18l6-6m12 6-6-6" />
      </>}
      {kind === 'compass' && <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8ZM12 1v2m0 18v2M1 12h2m18 0h2" />
      </>}
      {kind === 'key' && <>
        <circle cx="8" cy="8" r="4" />
        <path d="m11 11 9 9m-5-5 3-3m0 6 3-3" />
      </>}
      {kind === 'light' && <>
        <path d="M9 18h6m-6 3h6M8.5 15.5a6 6 0 1 1 7 0L15 18H9l-.5-2.5ZM12 2V1M3 6 1.5 5M21 6l1.5-1M2 12H1m22 0h-1" />
      </>}
    </svg>
  );
}
