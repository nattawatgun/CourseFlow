import SideBar from '../component/SideBar';
import EditAssignment from '../component/EditAssignment';
import classes from '../style/AddAssignment.module.css';

function EditAssignmentPage() {
  return (
    <>
      <div className={classes.assignmentContainer}>
        <SideBar isActive={'assignment'} />
        <EditAssignment />
      </div>
    </>
  );
}

export default EditAssignmentPage;