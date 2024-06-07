import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'

;

(async () => {
  const apps = import.meta.glob('./src/**/*.tsx')
  const demos = Object.fromEntries(Object.entries(apps).map(([key, value]) => [key.toLowerCase(), value]))

  const name = (location.pathname.replace(/^\//, '') || 'App').toLocaleLowerCase()
  const file = (apps[`./src/${name}.tsx`] || demos[`./src/${name}.tsx`]) as any
  if (!file) {
    location.pathname = 'App'
    return
  }
  const module = await file()
  const App = module.default || module[name]

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})()
