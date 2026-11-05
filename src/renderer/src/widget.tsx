import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WidgetApp } from './app/WidgetApp'
import './styles/widget-global.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <StrictMode>
    <WidgetApp />
  </StrictMode>,
)
