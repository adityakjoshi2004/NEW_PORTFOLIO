const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const SoundIcon = ({ on }) => (
  <svg {...base}>
    <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" />
    {on ? (
      <>
        <path d="M15.5 9a4.5 4.5 0 0 1 0 6" />
        <path d="M18 6.5a8 8 0 0 1 0 11" />
      </>
    ) : (
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    )}
  </svg>
)

export const ScrollIcon = () => (
  <svg {...base}>
    <path d="M7 4h11a2 2 0 0 1 2 2v1h-4" />
    <path d="M16 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1h10" />
    <path d="M7 4a2 2 0 0 0-2 2v11" />
    <path d="M9 9h4M9 12h4" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ArrowIcon = ({ dir = 'right' }) => (
  <svg {...base} style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const DownloadIcon = () => (
  <svg {...base}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
)

export const ExternalIcon = () => (
  <svg {...base} width={14} height={14}>
    <path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5" />
  </svg>
)

export const LeafIcon = () => (
  <svg {...base} width={12} height={12}>
    <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" />
    <path d="M5 19l8-8" />
  </svg>
)

export const SunIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
  </svg>
)

export const MoonIcon = () => (
  <svg {...base}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
)
