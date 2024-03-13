import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from './Background';
import classes from '../style/MyCourses.module.css';
import CourseCard from './CourseCard';
import { Tabs } from '@mantine/core';
import { ProfileContext } from '../context/ProfileContext';
import useAxiosWithAuth0 from '../utils/interceptor';
import { useAuth0 } from '@auth0/auth0-react';


function MyCourses () {
  const { axiosInstance } = useAxiosWithAuth0();
  const { isAuthenticated } = useAuth0();
  const [data, setData] = useState([]);
  
  const navigate = useNavigate();
  const { profile } = useContext(ProfileContext);

  useEffect(() => {
    const getDataAllCoursesById = async () => {
      if (isAuthenticated) {
        try {
          const response = await axiosInstance.get('/user/subscribed-course'); // ตัวดั้งเดิม
          setData(response.data.data);
          console.log(response.data.data);
        } catch (error) {
          console.error('Error fetching subscription data:', error);
        }
      }
    };
    getDataAllCoursesById();
  }, [isAuthenticated]);

  // Course card
  // Map all subscribedCourse for each users to CourseCard
  const courseCardAllcourses = data?.map((item, index) => (
    <div key={index} onClick={() => {
      navigate(`/learn/${item.id}`);
    }}>
      <CourseCard 
        detailCourse={item}
      />
    </div>
  ));

  // Map inprogress courses
  const courseCardInprogress = data
    .filter(item => item.courseCompletion === 'IN_PROGRESS')
    .map((item, index) => (
      <div key={index} onClick={() => navigate(`/course-detail/${item.course.id}`)}>
        <CourseCard detailCourse={item.course} />
      </div>
    ));

  // Map completed courses
  const courseCardCompleted = data
    .filter(item => item.courseCompletion === 'COMPLETED')
    .map((item, index) => (
      <div key={index} onClick={() => navigate(`/course-detail/${item.course.id}`)}>
        <CourseCard detailCourse={item.course} />
      </div>
    ));

  return (
    <>
      <div className={classes.myCourses}>
        <Background />

        <div className={classes.myCoursesTitle}>
          <h2>My Courses</h2>
        </div>

        <div className={classes.containerMyCourses}>

          {/* User profile & courses progression */}
          <div className={classes.containerStickyBox}>
            <div className={classes.stickyBox}>

              <div className={classes.profilePicture}>
                <img src={profile?.avatarUrl} className={classes.setProfilePicture} />
              </div>

              <div className={classes.userName}>
                <p className={classes.setUserName}>{profile && profile.name}</p>
              </div>

              <div className={classes.status}>
                <div className={classes.smallBox}>
                  <span style={{ color:'#646D89' }}>Course Inprogress</span>
                  <span>{courseCardInprogress.length}</span>
                </div>
                <div className={classes.smallBox}>
                  <span style={{ color:'#646D89' }}>Course Complete</span>
                  <span>{courseCardCompleted.length}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Tab section */}
          <Tabs color="dark" defaultValue="first" >
  
            <div className={classes.tabPosition} >
              <Tabs.List> 
                <Tabs.Tab value="first">All Courses</Tabs.Tab>
                <Tabs.Tab value="second">Inprogress</Tabs.Tab>
                <Tabs.Tab value="third">Complete</Tabs.Tab>
              </Tabs.List>
            </div>
              
            <div className={classes.containerCoursesCards}>

              {/* All courses tab */}
              <Tabs.Panel value="first" pl='45'>
                <div className={classes.courseCard}>
                  {courseCardAllcourses}     
                </div>
              </Tabs.Panel>

              {/* inprogress courses tab */}
              <Tabs.Panel value="second" pl='45'>
                <div className={classes.courseCard}>
                  {courseCardInprogress}
                </div>
              </Tabs.Panel>

              {/* complete courses tab */}
              <Tabs.Panel value="third" pl='45'>
                <div className={classes.courseCard}> 
                  {courseCardCompleted}   
                </div>
              </Tabs.Panel>

            </div>

          </Tabs>

        </div>
      </div>
    </>
  );
}

export default MyCourses;