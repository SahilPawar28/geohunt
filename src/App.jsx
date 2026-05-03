import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Solo from './pages/Solo'
import Group from './pages/Group'
import Room from './pages/Room'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solo" element={<Solo />} />
        <Route path="/group" element={<Group />} />
        <Route path="/room/:code" element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
