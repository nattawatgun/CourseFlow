import { Textarea, Group, Text, Button, Container } from '@mantine/core';
import AssignmentStatus from './AssignmentStatus';
import { useState } from 'react';
import dayjs from 'dayjs';
import useAxiosWithAuth0 from '../../utils/interceptor';
import classes from '../../style/CourseViewer/SublessonAssignment.module.css';
import { useToggle } from '@mantine/hooks';

function getTimeRemainingMessages(dueDate, submittedAnswer) {
  if (submittedAnswer) {
    return ['Submitted', ''];
  }
  else if (!dueDate) { // not submitted but no deadline.
    return ['Pending', ''];
  }
  else {
    const due = dayjs(dueDate);
    const today = dayjs();
    const msPerDay = 1000 * 60 * 60 * 24;
    // diff in ms
    const msRemaining = due.diff(today);
    const daysRemaining = Math.ceil(msRemaining / msPerDay);
    
    if (daysRemaining >= 1) {
      return ['Pending', `Due in ${daysRemaining} days`];
    }
    else {
      return ['Overdue', `${Math.abs(daysRemaining)} day(s) overdue`];
    }

  }

}



function SublessonAssignment({ userAssignment, setSublessonsStatus, sublessonId }) {
  const { axiosInstance } = useAxiosWithAuth0();
  const { assignment, completeByDate, id: userAssignmentId, answer: submittedAnswer = null } = userAssignment;
  const [assignmentStatusText, setAssignmentStatusText] = useState(getTimeRemainingMessages(completeByDate, submittedAnswer));
  const [answer, setAnswer] = useState('');
  const [isSubmitting, toggleSubmitting] = useToggle();
  const [submitSuccess, toggleSubmitSuccess] = useToggle();

  async function handleSubmission(answer, userAssignmentId, assignmentId) {
    try {
      toggleSubmitting();
      const result = await axiosInstance.put('/user/assignment', { assignmentId, userAssignmentId, answer });
      if (result.data.success) {
        setAssignmentStatusText(['Submitted', '']);
        setSublessonsStatus(prevSublessonsStatus => ({ ...prevSublessonsStatus, [sublessonId]: 'COMPLETED' }));
        toggleSubmitSuccess();
      }
    }
    catch (error) {
      console.error(error);
      window.alert('Error: Could not submit assignment.');
    }
    finally {
      toggleSubmitting();
    }
  }

  return (
    <div className={classes.assignmentContainer}>
      <Group justify="space-between">
        <Text size='xl'>Assignment</Text>
        <AssignmentStatus>{assignmentStatusText[0]}</AssignmentStatus>
      </Group>
      <Container className={classes.assignmentAnswer}>
        <label htmlFor="answer">{assignment.title}</label>
        {submittedAnswer || submitSuccess ? (
          <Text>{submittedAnswer}</Text>
        ) : (
          <Textarea
            id="answer"
            autosize
            minRows={4}
            maxRows={4}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            placeholder="Answer..."
          />
        )}
      </Container>
      {!(submittedAnswer || submitSuccess) && 
      <Group justify="space-between" align="center" className={classes.assignmentSubmission}>
        <Button
          onClick={() =>
            handleSubmission(answer, userAssignmentId, assignment.id)
          }
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Send Assignment
        </Button>
        <Text className={classes.secondaryText} c='#646D89'>{assignmentStatusText[1]}</Text>
      </Group>}
    </div>
  );
}
export default SublessonAssignment;