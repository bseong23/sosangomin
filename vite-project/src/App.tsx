import { useState } from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/favicon.svg'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="flex justify-center gap-4">
        <a href="https://vite.dev" target="_blank" className="group">
          <img 
            src={appLogo} 
            className="h-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.67)]" 
            alt="vite-project logo" 
          />
        </a>
        <a href="https://react.dev" target="_blank" className="group">
          <img 
            src={reactLogo} 
            className="h-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_rgba(97,218,251,0.67)] animate-[spin_20s_linear_infinite]" 
            alt="React logo" 
          />
        </a>
      </div>
      
      <h1 className="text-3xl font-bold my-4">vite-project</h1>
      
      <div className="p-8 mb-4">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-4 transition-colors"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
