import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from './features/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
      <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
  </BrowserRouter>
 
)
