interface Props {
  size?: number
  warpColor?: string
  weftColor?: string
  className?: string
}

export default function WovenIcon({
  size = 20,
  warpColor = '#1A1A1A',
  weftColor = '#C79A3E',
  className = '',
}: Props) {
  const s = size
  const ratio = s / 20
  const w = s
  const h = Math.round(24 * ratio)

  return (
    <svg width={w} height={h} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* 4 vertical warp threads */}
      <line x1="2.5"  y1="1" x2="2.5"  y2="23" stroke={warpColor} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8.5"  y1="1" x2="8.5"  y2="23" stroke={warpColor} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14.5" y1="1" x2="14.5" y2="23" stroke={warpColor} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20.5" y1="1" x2="20.5" y2="23" stroke={warpColor} strokeWidth="1.5" strokeLinecap="round"/>
      {/* 3 weft threads — plain weave over/under pattern */}
      <line x1="0"  y1="8"  x2="5.5" y2="8"  stroke={weftColor} strokeWidth="2" strokeLinecap="round"/>
      <line x1="11.5" y1="8"  x2="17.5" y2="8"  stroke={weftColor} strokeWidth="2" strokeLinecap="round"/>
      <line x1="5.5"  y1="14" x2="11.5" y2="14" stroke={weftColor} strokeWidth="2" strokeLinecap="round"/>
      <line x1="17.5" y1="14" x2="23"   y2="14" stroke={weftColor} strokeWidth="2" strokeLinecap="round"/>
      <line x1="0"  y1="20" x2="5.5" y2="20" stroke={weftColor} strokeWidth="2" strokeLinecap="round"/>
      <line x1="11.5" y1="20" x2="17.5" y2="20" stroke={weftColor} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
