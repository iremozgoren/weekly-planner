import './SegmentedControl.css'

type SegmentedControlProps<T extends string> = {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  'aria-label': string
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ...rest
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented" role="radiogroup" {...rest}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className="segmented__option"
          data-active={value === option.value || undefined}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
