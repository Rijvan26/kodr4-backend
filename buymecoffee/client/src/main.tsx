import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './app/store/store.ts'
import AppRouter from './app/routes/AppRoutes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>

    <AppRouter/>
    </Provider>
  </StrictMode>,
)
