// import AddCourse from "../component/AddCourse";
// import AddLesson from "../component/AddLesson";
import React,{ useState } from 'react';
import { useToggle } from '@mantine/hooks';
import AddCoursePage from './AddCoursePage';
import AddLessonPage from './AddLessonPage';

function AddCourseAndLessonPage() {

  const [lesson, setLesson] = useState('');
  const [subLessons, setSubLessons] = useState([{index: 1, title: '', videoUrl: ''}]);

  const [addCoursePage, toggleAddCoursePage] = useToggle([true, false]);

  const [lessonData, setLessonData]= useState([]);

  return (
    <>
      <div hidden={!addCoursePage}>
        <AddCoursePage
          lesson={lesson}
          setLesson={setLesson}
          subLessons={subLessons}
          setSubLessons={setSubLessons}
          lessonData={lessonData}
          setLessonData={setLessonData}
          toggleAddCoursePage={toggleAddCoursePage}
        />
      </div>
      <div hidden={addCoursePage}>
        <AddLessonPage
          lesson={lesson}
          setLesson={setLesson}
          subLessons={subLessons}
          setSubLessons={setSubLessons}
          lessonData={lessonData}
          setLessonData={setLessonData}
          toggleAddCoursePage={toggleAddCoursePage}
        />
      </div>

      
    </>
  );
}

export default AddCourseAndLessonPage;