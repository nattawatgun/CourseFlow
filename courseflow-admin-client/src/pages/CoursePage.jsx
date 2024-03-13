import SideBar from '../component/SideBar';
import Course from '../component/Course';
import classes from '../style/Course.module.css';

function CoursePage() {
  return (
    <div className={classes.container}>
      <SideBar  isActive={'course'} />
      <Course />
    </div>
  );
}

export default CoursePage;