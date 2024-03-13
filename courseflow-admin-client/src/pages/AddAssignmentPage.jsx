import SideBar from '../component/SideBar';
import AddAssignment from '../component/AddAssignment';
import classes from '../style/AddAssignment.module.css';

function AddAssignmentPage() {
  return (
    <>
      <div className={classes.assignmentContainer}>
        <SideBar isActive={'assignment'} />
        <AddAssignment />
      </div>
    </>
  );
}

export default AddAssignmentPage;