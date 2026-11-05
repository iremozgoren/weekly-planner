import type { InputHTMLAttributes } from 'react'
import './Checkbox.css'

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'onChange' | 'type'
> & {
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
