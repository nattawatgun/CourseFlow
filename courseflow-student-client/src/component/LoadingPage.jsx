import classes from '../style/LoadingPage.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center } from '@mantine/core';
function LoadingPage() {

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the homepage after a set time
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000); // Adjust the delay as needed

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <Center className={classes.alignment}>
      <div className={classes.loader}></div>
    </Center>
    
  );
}
export default LoadingPage;