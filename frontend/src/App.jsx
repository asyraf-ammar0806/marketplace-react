import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  // Simple check: do we have a token stored in the browser?
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        {/* If a user goes to root path '/', redirect based on authentication status */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />

        {/* Define clean URL routing paths */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all route: If the user types a random URL, send them home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App