import type { ButtonHTMLAttributes } from 'react'
import './IconButton.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string
}

export function IconButton({ className = '', ...rest }: IconButtonProps) {
  return <button type="button" className={`icon-button ${className}`.trim()} {...rest} />
}
