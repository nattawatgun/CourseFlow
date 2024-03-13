import SideBar from '../component/SideBar';
import AddLesson from '../component/AddLesson';
import classes from '../style/AddCourse.module.css';

function AddLessonPage({lesson, setLesson, subLessons, setSubLessons, lessonData, setLessonData, toggleAddCoursePage}) {
  
  return (
    <div className={classes.container} >
      <SideBar  isActive={'course'} />
      <AddLesson
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

export default AddLessonPage;