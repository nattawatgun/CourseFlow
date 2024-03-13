import SideBar from '../component/SideBar';
import Assignment from '../component/Assignment';
import classes from '../style/Assignment.module.css';

function AssignmentPage() {
  return (
    <>
      <div className={classes.assignmentContainer}>
        <SideBar isActive={'assignment'} />
        <Assignment />
      </div>
    </>
  );
}

export default AssignmentPage;