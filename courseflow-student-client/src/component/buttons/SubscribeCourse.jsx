import { Button } from '@mantine/core';

function SubscribeCourse({ checkAuth, openSubscribeModal }) {
  return (
    // This button opens a modal, and the application logic is handled within the modal
    <Button onClick={checkAuth(openSubscribeModal)}>
      Subscribe to this course
    </Button>
  );
}

export default SubscribeCourse;
