
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';
import CoursePage from './pages/CoursePage';
import AssignmentPage from './pages/AssignmentPage';
import AddAssignmentPage from './pages/AddAssignmentPage';
import EditAssignmentPage from './pages/EditAssignmentPage';
import AddCourseAndLessonPage from './pages/AddCourseAndLessonsPage';
import Callback from './pages/Callback';
import EditCoursePage from './pages/EditCoursePage';
import './App.css';

export default function App() {
  

  return (
    <MantineProvider>
      <Routes>
        <Route path="/course" element={<CoursePage/>} />
        <Route path='/assignment' element={<AssignmentPage />} />
        <Route path='/assignment/add' element={<AddAssignmentPage />} />
        <Route path='/assignment/edit/:assignmentId' element={<EditAssignmentPage />} />
        <Route path="/course/add-course" element={<AddCourseAndLessonPage/>} />
        <Route path='/callback' element={<Callback />} />
        <Route path="/course/edit-course/:courseId" element={<EditCoursePage />} />
      </Routes>
    </MantineProvider>
  );
}