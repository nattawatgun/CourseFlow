import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function GoToCourse({ courseId }) {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(`/learn/${courseId}`)}>Start Learning</Button>
  );
}
export default GoToCourse;