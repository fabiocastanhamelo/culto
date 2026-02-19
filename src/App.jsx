import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Success from './pages/Success'
import Error from './pages/Error'
import Pending from './pages/Pending'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sucesso" element={<Success />} />
      <Route path="/erro" element={<Error />} />
      <Route path="/pendente" element={<Pending />} />
    </Routes>
  )
}

export default App
