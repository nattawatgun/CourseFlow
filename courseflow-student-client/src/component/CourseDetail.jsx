import classes from '../style/CourseDetail.module.css';
import { useState, useEffect } from 'react';
import { Accordion } from '@mantine/core';
import CourseCard from './CourseCard';
import { imageCourseDetail } from '../data/imageBackground';
import { useNavigate,useParams } from 'react-router-dom';
import { Modal } from '@mantine/core';
import useaxios0 from '../utils/interceptor';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import CourseDetailButtonsStack from './CourseDetailButtonsStack';

function CourseDetail () {
  const [courseData, setCourseData] = useState([]);
  const [randomCourse, setRandomCourse] = useState([]);
  const [course, setCourse] = useState({});

  const [desiredModal, setDesiredModal] = useState(false);
  const [subscribeModal, setSubscribedModal] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const getCourseData = async() => {
    const response = await axios.get(import.meta.env.VITE_API_SERVER+'/course');
    setCourseData(response.data);
  };

  const getCourseDataById = async()=>{
    const response = await axios.get(import.meta.env.VITE_API_SERVER+`/course/${params.courseId}`);
    setCourse(response.data);
  };

  useEffect (() => {
    getCourseData();
    getCourseDataById();
  }, []);

  useEffect(() => {
    getRandomCourse(courseData,3);
  }, [course]);

  const accordion = course.lessons?.map((lesson, idx) => {
    const unorderedSublessonList = lesson.sublessons.map((sublesson) => {
      return (
        <li key={sublesson.id}>{sublesson.title}</li>
      );
    });
    return (  
      <Accordion.Item key={idx} value={`lesson-${idx+1}`}>
        <Accordion.Control icon={<h3 style={{ color: 'var(--gray-700, #646D89)' }}>{idx+1}</h3>}>
          <h3>{lesson.title}</h3>
        </Accordion.Control>
        <Accordion.Panel>
          <ul>
            {unorderedSublessonList}
          </ul>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });


  const getRandomCourse = (data, count) => {
    console.log(data);
    console.log(course.id);
    const filteredCourseData = data.filter(item => item.id !== course.id);
    console.log(filteredCourseData);
    const shuffledCourseData = filteredCourseData.sort(() => Math.random() - 0.5);
    const selectedCourses = shuffledCourseData.slice(0, count);
    setRandomCourse(selectedCourses);
  };


  const randomDataElements = randomCourse.map((item) => (
    <div key={item.id} onClick={() => {
      navigate(`/course-detail/${item.id}`);
      window.location.reload();
    }}>
      <CourseCard detailCourse={item} />
    </div>
  ));

  const number = course.price;
  const options = {
    style: 'decimal', // This is the default value; it's included here for demonstration.
    minimumFractionDigits: 2, // Ensures that there are at least two digits after the decimal point.
    maximumFractionDigits: 2, // Ensures that there are no more than two digits after the decimal point.
  };
  const priceFormattedNumber =  number?.toLocaleString('en-US', options)||'0.00';
  // console.log(priceFormattedNumber); // Output: "1,234,567.89"  

  return (
    <>  
      <div className={classes.containerPage}>
        <div className={classes.containerCourseDetail}>
          <button className={classes.buttonBack} onClick={() => {
            navigate('/our-course');
          }}>
            <img src={imageCourseDetail.arrowBack} /> <p className='cf-body-2' style={{ fontWeight: '700' }}>Back</p>
          </button>
          <div className={classes.container}>
            <div className={classes.dataContainer}>
              <iframe width="800" height="460" src={course.videoTrailerUrl} allowFullScreen frameBorder="0"></iframe>
              <div>
                <h2>Course Detail</h2>
                <div className='cf-body-2'>
                  {course.detail}
                </div>
              </div>
              <div className={classes.accordion}>
                <h2>Module Samples</h2>


                <Accordion defaultValue="lesson-1" >
                  {accordion}
                </Accordion>
              </div> 
            </div>


            <div className={classes.stickyBoxContainer}>
              <div className={classes.stickyBox}>
                <div className={classes.containerTextStickyBox}>
                  <div className='cf-body-3' style={{ color: '#F47E20' }}>Course</div>
                  <h3>{course.name}</h3>
                  <span className='cf-body-2' style={{ color: '#646D89' }}>
                    {course.summary}
                  </span>
                  <h3 style={{ color: '#646D89' }}>THB {priceFormattedNumber}</h3>
                </div>  
                <div className={classes.containerButtonStickyBox}>
                  <CourseDetailButtonsStack courseId={params.courseId} courseName={course.name} />
                </div>
              </div>
            </div>
            
          </div>  
        </div>
      </div>
      
      <div className={classes.containerOtherInterestingCourse}>
        <h2>Other Interesting Course</h2>
        <div className={classes.containerCardOtherInterestingCourse}>
          {randomDataElements}
        </div>
      </div>
      
    </>
  );
}

export default CourseDetail;