import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Layout from './components/Layout.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <Layout>
    <App />
  </Layout>
)
