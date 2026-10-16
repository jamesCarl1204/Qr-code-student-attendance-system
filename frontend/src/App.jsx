import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import StudentPortal from './pages/StudentPortal/StudentPortal'
import TeacherPortal from './pages/TeacherPortal/TeacherPortal'
import ProtectedRoute from './componets/ProtectedRoute/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
         path="/student/dashboard"
         element={<ProtectedRoute role="student"><StudentPortal/></ProtectedRoute>} />
        <Route 
        path="/teacher/dashboard" 
        element={<ProtectedRoute role="teacher"><TeacherPortal /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
