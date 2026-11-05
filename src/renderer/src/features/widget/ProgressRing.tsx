import './ProgressRing.css'

type ProgressRingProps = {
  done: number
  total: number
  size?: number
}

export function ProgressRing({ done, total, size = 48 }: ProgressRingProps) {
  const strokeWidth = 5
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const fraction = total > 0 ? done / total : 0
  const center = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-ring">
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle
          className="progress-ring__track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring__fill"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </g>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="progress-ring__label"
      >
        {total > 0 ? `${done}/${total}` : '–'}
      </text>
    </svg>
  )
}
