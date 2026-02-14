import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { SoundProvider } from './contexts/SoundContext';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
