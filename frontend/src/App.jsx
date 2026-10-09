import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import StudentPortal from './pages/StudentPortal'
import TeacherPortal from './pages/TeacherPortal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student/dashboard" element={<StudentPortal />} />
        <Route path="/teacher/dashboard" element={<TeacherPortal />} />
      </Routes>
    </BrowserRouter>
  )
}