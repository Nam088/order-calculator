import OrderCalculator from './components/OrderCalculator'
import { ToastProvider } from './components/ToastContext'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <OrderCalculator />
      </div>
    </ToastProvider>
  )
}

export default App
