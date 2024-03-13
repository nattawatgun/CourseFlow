import SideBar from '../component/SideBar';
import AddCourse from '../component/AddCourse';
import classes from '../style/AddCourse.module.css';

function AddCoursePage({lesson, setLesson, subLessons, setSubLessons, lessonData, setLessonData, toggleAddCoursePage}) {
  return (
    <div className={classes.container} >
      <SideBar  isActive={'course'} />
      <AddCourse
        lesson={lesson}
        setLesson={setLesson}
        subLessons={subLessons}
        setSubLessons={setSubLessons}
        lessonData={lessonData}
        setLessonData={setLessonData}
        toggleAddCoursePage={toggleAddCoursePage}
      />
    </div>
  );
}

export default AddCoursePage;