import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import StudentPortal from './pages/StudentPortal/StudentPortal'
import StudentClassDetail from './pages/StudentPortal/StudentClassDetail'
import TeacherPortal from './pages/TeacherPortal/TeacherPortal'
import ClassDetail from './pages/TeacherPortal/ClassDetail/ClassDetail'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/student/dashboard"
          element={<ProtectedRoute role="student"><StudentPortal /></ProtectedRoute>}
        />
        <Route
          path="/student/classes/:id"
          element={<ProtectedRoute role="student"><StudentClassDetail /></ProtectedRoute>}
        />
        <Route
          path="/teacher/dashboard"
          element={<ProtectedRoute role="teacher"><TeacherPortal /></ProtectedRoute>}
        />
        <Route
          path="/teacher/classes/:id"
          element={<ProtectedRoute role="teacher"><ClassDetail /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}