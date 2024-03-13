import React,{ useState, useEffect } from 'react';
import classes from '../style/OurCourse.module.css';
import Background from './Background';
import CourseCard from './CourseCard';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import useAxiosWithAuth0 from '../utils/interceptor';

function DesiredCourses (){
  const [data,setData] = useState([]);
  const { axiosInstance } = useAxiosWithAuth0();

  const { isAuthenticated } = useAuth0();


  useEffect(()=>{
    const fetchData = async () => {
      if (isAuthenticated) {
        try{
          const response = await axiosInstance.get('/user/desired-course');
          setData(response.data.data);
        }catch(error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  },[isAuthenticated]);
  console.log(data);
  const navigate = useNavigate();


  const courseCard = data.map((course,index)=>{
    console.log(course);
    return(
      <div key={index} onClick={()=>{
        navigate(`/course-detail/${course.course.id}`);
      }} >
        <CourseCard detailCourse={course.course} />
      </div>
    );
  });

  return(
    
    <div className={classes.disiredCourses}>
      <Background />

      <div className={classes.searchTitle}>
        <h2>Desired Courses</h2>
      </div>

      <div className={classes.containerCourseCards}>
        <div className={classes.courseCard}>
          {courseCard}
        </div>
      </div>
      
      
    </div>
    
  );
  
}

export default DesiredCourses;