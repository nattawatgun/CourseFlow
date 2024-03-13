import SideBar from '../component/SideBar';
import EditCourse from '../component/EditCourse';
import classes from '../style/AddCourse.module.css';

function EditCoursePage () {
  return (
    <>

      <div className={classes.container}>
        <SideBar  isActive={'course'} />
        <EditCourse />
      </div>

    </>
  );
}

export default EditCoursePage;