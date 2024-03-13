import { Button } from '@mantine/core';
import useAxiosWithAuth0 from '../../utils/interceptor';


function ToggleDesiredCourse({ courseId, isDesiredCourse, setIsDesiredCourse, checkAuth }) {
  const { axiosInstance } = useAxiosWithAuth0();

  async function remove() {
    try {
      await axiosInstance.delete('/user/desired-course', {
        data: { courseId: courseId }
      });
      setIsDesiredCourse(false);
    } catch (error) {
      console.error(error);
    }
    
  }

  async function add() {
    try {
      await axiosInstance.post('/user/desired-course', { courseId: courseId });
      setIsDesiredCourse(true);
      console.log(courseId, 'added to desired course');
    } catch (error) {
      console.error(error);
    }
  }

  if (isDesiredCourse) {
    return <Button variant='secondary' onClick={checkAuth(remove)}>Remove from Desired Course</Button>;
  } else {
    return <Button variant='secondary' onClick={checkAuth(add)}>Add to Desired Course</Button>;
  }

}

export default ToggleDesiredCourse;