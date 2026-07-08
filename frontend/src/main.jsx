import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import './index.css'
import App from './App.jsx'
import { ProductsProvider } from './context/ProductsContext'
import { CmsProvider } from './context/CmsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <CmsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CmsProvider>
    </ProductsProvider>
  </StrictMode>,
)
