import classes from '../style/Course.module.css';
import { imagesCourse } from '../data/images.js';
import {useState, useEffect } from 'react';
import useAxiosWithAuth0 from '../interceptor.js';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass } from 'react-loader-spinner';

function Course() {

  const { axiosInstance } = useAxiosWithAuth0();
  const navigate = useNavigate();

  const [course, setCourse] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isFirstLoad, setIsfirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const getCourses = async (keywords) => {
    try {
      setIsLoading(true);
      const delaytime = 1500;
      const results = await axiosInstance.get('/course', {
        params: {
          keywords: keywords
        }
      });
      setCourse(results.data);
      console.log(results.data);
      setTimeout(() => {
        setIsLoading(false);
      }, delaytime);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/course/${courseId}`,
        { data: {
          courseId
        }
        });
      getCourses(searchInput);  
      return console.log(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isFirstLoad) {
      const delay = setTimeout(() => {
        getCourses(searchInput);
      }, 1000);
      return () => clearTimeout(delay);
    } else {
      getCourses(searchInput);
      setIsfirstLoad(false);
    }
  }, [searchInput]);

  return (
    <div>
      <div className={classes.courseBar}>
        <h3 style={{ color: 'var(--gray-900, #2A2E3F)' }}>Course</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input className={classes.searchBox} value={searchInput} onChange={(event) => setSearchInput(event.target.value)} type='text' placeholder='Search...' />
          <button className={classes.addCourseButton} onClick={() => navigate('/course/add-course')}>
            <span className='cf-body-2' style={{ fontWeight: '700', color: '#FFF' }}>+ Add Course</span>
          </button>
        </div>
      </div>
      <div className={classes.courseBox}>
        <div className={classes.courseHeadTable}>
          <div className='cf-body-3' style={{ width: '48px', height: '41px',display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--gray-800, #424C6B)' }}>
            id
          </div>
          <div className={classes.head}>
            <span style={{width: '64px'}}>Image</span>
          </div>
          <div className={classes.head}>
            <span style={{width: '236px'}}>Course name</span>
          </div>
          <div className={classes.head}>
            <span style={{width: '73px'}}>Lesson</span>
          </div>
          <div className={classes.head}>
            <span style={{width: '73px'}}>Price</span>
          </div>
          <div className={classes.head}>
            <span style={{width: '156px'}}>Created date</span>
          </div>
          <div className={classes.head}>
            <span style={{width: '158px'}}>Updated date</span>
          </div>
          <div className={classes.head}>
            <span style={{width: '72px', padding: '0px 8px'}}>Action</span>
          </div>
        </div>
        {isLoading && <div style={{marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems:'center'}}>
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperClass="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#445a7e"
          />
          <h2>Please remain Calm...</h2>
        </div>}
        
        {!isLoading && <div>
          {
            course.map((item, index) => {
              const isLastItem = index === course.length - 1;
              const classNames = `${classes.courseList} ${isLastItem ? classes.lastItem : ''}`;
              course.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
              return (
                <div className={classNames} key={item.id}>
                  <div className={classes.id}>{item.id}</div>
                  <div className={classes.image}><img style={{ maxWidth: '64px'}} src={item.coverImageUrl} alt='image'/></div>
                  <div className={classes.courseName}>{item.name}</div>
                  <div className={classes.lesson}>{item.totalLearningTime}</div>
                  <div className={classes.price}>{item.price}</div>
                  <div className={classes.createddate}>{item.createdAt}</div>
                  <div className={classes.updateddate}>{item.updatedAt}</div>
                  <div className={classes.action}>
                    <img src={imagesCourse.deleteIcon} alt='deleteIcon' style={{cursor: 'pointer'}} onClick={() => deleteCourse(item.id)}/>
                    <img src={imagesCourse.editIcon} alt='editIcon'  style={{cursor: 'pointer'}} onClick={()=>navigate(`/course/edit-course/${item.id}`)} />
                  </div>
                </div>
              );
            })
          }
        </div>}
      </div>
    </div>
  );
}

export default Course;
