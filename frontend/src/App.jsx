import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import StudentPortal from './pages/StudentPortal/StudentPortal'
import TeacherPortal from './pages/TeacherPortal/TeacherPortal'

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
