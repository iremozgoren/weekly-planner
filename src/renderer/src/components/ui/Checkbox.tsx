import './Checkbox.css'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label': string
}

export function Checkbox({ checked, onChange, ...rest }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      {...rest}
    />
  )
}
