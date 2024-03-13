import { Routes, Route } from 'react-router-dom';
import {
  Register,
  Profile,
  OurCourse,
  Landing,
  Header,
  Footer,
  CourseDetail,
  MyCourses,
  DesiredCourses,
  Assignments
} from '../component';
import CourseViewer from '../component/CourseViewer/CourseViewer';
import { ProfileProvider } from '../context/ProfileContext';
import TestZone from '../utils/TestZone';
import { AuthenticationGuard } from '../utils/authentication-guard';

function PagesRouter() {
  return (
    <ProfileProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path='/our-course' element={<OurCourse/>} />
        <Route path='/register' element={<Register />} />
        <Route path="/course-detail/:courseId" element={<CourseDetail/>} />
        <Route path='/profile'  element={<AuthenticationGuard component={Profile} />} />
        <Route path='/my-courses' element={<AuthenticationGuard component={MyCourses} />} />
        <Route path='/desired-courses' element={<AuthenticationGuard component={DesiredCourses} />} />
        <Route path='/assignments' element={<AuthenticationGuard component={Assignments} />} />
        <Route path='/learn/:courseId' element={<AuthenticationGuard component={CourseViewer} />} />
        <Route path='/test-zone' element={<TestZone />} />
      </Routes>
      <Footer />
    </ProfileProvider>
  );
}

export default PagesRouter;