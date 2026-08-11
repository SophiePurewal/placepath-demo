import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

document.title = 'PlacePath — Industry placement management'

const metaDesc = document.querySelector('meta[name="description"]')
if (metaDesc) {
  metaDesc.setAttribute('content', 'A responsive, role-based application for coordinating student industry placements.')
} else {
  const m = document.createElement('meta')
  m.name = 'description'
  m.content = 'A responsive, role-based application for coordinating student industry placements.'
  document.head.appendChild(m)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
