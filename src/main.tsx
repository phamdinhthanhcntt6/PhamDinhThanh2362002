import 'antd/dist/reset.css'
import './index.css'

import { App as AntApp } from 'antd'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { store } from './store/store'

const rootEl = document.getElementById('app')

if (!rootEl) {
  throw new Error('Root element #app not found')
}

createRoot(rootEl).render(
  <Provider store={store}>
    <BrowserRouter>
      <AntApp>
        <App />
      </AntApp>
    </BrowserRouter>
  </Provider>,
)

