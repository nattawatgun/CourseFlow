import classes from '../style/AddAssignment.module.css';
import { useNavigate } from 'react-router-dom';
import { Select, TextInput } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { imageAddAssignment } from '../data/images';

function AddAssignment() {
  const navigate = useNavigate();
  const [dataCourseDetail, setDataCourseDetail] = useState([]);
  const [courseValue, setCourseValue] = useState();
  const [lessons, setLessons] = useState([]);
  const [lessonValue, setLessonValue] = useState();
  const [subLessons, setSubLessons] = useState([]);
  const [subLessonValue, setSubLessonValue] = useState();
  const [subLessonId, setSubLessonId] = useState();
  const [assignment, setAssignment] = useState();
  const [duration, setDuration] = useState();
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const getCourseDetail = async () => {
    try{
      const result = await axios.get(import.meta.env.VITE_API_SERVER + '/course/detail/test');
      setDataCourseDetail(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }  
  };

  const createAssignment = async (data) => {
    try {
      await axios.post(import.meta.env.VITE_API_SERVER + '/assignment', 
        data);
      navigate('/assignment');
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setButtonDisabled(true);
    createAssignment({
      assignment,
      duration,
      subLessonId
    });
    setButtonDisabled(false);
  };

  useEffect(() => {
    getCourseDetail();
  }, []);

  useEffect(() => {
    findLesson();
    findSubLesson();
  }, [courseValue, lessonValue]);

  const handleChangeCourse = (event) => {
    setLessonValue(null);
    setSubLessonValue(null);
    setCourseValue(event);
  };

  const handleChangeLesson = (event) => {
    setSubLessonValue(null);
    setLessonValue(event);
  };

  const handleChangeSubLesson = (event) => {
    setSubLessonValue(event);
    const subLessonId = subLessons.filter((lesson) => lesson.title === event);
    setSubLessonId(subLessonId[0].id);
  };

  const handleChangeDuration = (event) => {
    const numberDuration = event.split('');
    setDuration(numberDuration[0]);
  };

  const findLesson = () => {
    const findCourse = dataCourseDetail.filter((course) => course.name === courseValue);
    
    if (findCourse.length > 0) {  
      const lessonsForSelectedCourse = findCourse[0].lessons;
      setLessons(lessonsForSelectedCourse);
    }
  };

  const findSubLesson = () => {
    const findLesson = lessons.filter((lesson) => lesson.title === lessonValue);
    
    if (findLesson.length > 0) {
      const subLessonForSelectedLesson = findLesson[0].sublessons;
      setSubLessons(subLessonForSelectedLesson);
      console.log(subLessonForSelectedLesson);
    } else {
      setSubLessons([]);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className={classes.navbar}>
        <h3>Add Assignments</h3>
        <div className={classes.leftNavbar}>
          <button onClick={() => navigate('/assignment')} className={classes.buttonCancel}>
            <p className='cf-body-2' style={{fontWeight: '700'}}>Cancel</p>
          </button>
          <button className={!isButtonDisabled ? classes.button : classes.buttonAfterClick} type='onSubmit'>
            <p className='cf-body-2' style={{fontWeight: '700'}}>Create</p>
          </button>
        </div>
      </div>
      <div className={classes.mainContainer}>
        <div className={classes.container}>
          <Select
            label='Course'
            size='md'
            data={dataCourseDetail.map((course) => course.name)}
            onChange={handleChangeCourse}
            placeholder='Select Course'
            className={classes.select}
            clearable
            searchable
            nothingFoundMessage="Nothing found..."
            rightSectionPointerEvents="none"
            rightSection={<img src={imageAddAssignment.arrowDropDown} alt="Arrow Icon" />}
            required
          />
          <div className={classes.selectInContainer}>
            <Select
              label='Lesson'
              size='md'
              data={lessons.map((lesson) => lesson.title)}
              value={lessonValue}
              onChange={handleChangeLesson}
              placeholder='Select Lesson'
              className={classes.select}
              clearable
              disabled={!courseValue}
              searchable
              nothingFoundMessage="Nothing found..."
              rightSectionPointerEvents="none"
              rightSection={<img src={imageAddAssignment.arrowDropDown} alt="Arrow Icon" />}
              required
            />
            <Select
              label='Sub-Lesson'
              size='md'
              data={subLessons.map((subLesson) => subLesson.title)}
              value={subLessonValue}
              onChange={handleChangeSubLesson}
              placeholder='Select Sub-Lesson'
              className={classes.select}
              disabled={!lessonValue}
              clearable
              searchable
              nothingFoundMessage="Nothing found..."
              rightSectionPointerEvents="none"
              rightSection={<img src={imageAddAssignment.arrowDropDown} alt="Arrow Icon" />}
              required
            />
          </div>
          <div className={classes.underline}></div>
          <p className='cf-body-1' style={{ fontWeight: '600', color: '#646D89' }}>Assignment detail</p>
          <TextInput 
            label='Assignment' 
            size='md' 
            placeholder='Please Input Assignment'
            onChange={(e) => {setAssignment(e.target.value);}} 
            required
          /> 
          <Select
            label='Duration of assignment (day)'
            data={['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days']}
            placeholder='Select Duration of assignment (day)'
            onChange={handleChangeDuration}
            size='md'
            className={classes.select}
            rightSectionPointerEvents="none"
            rightSection={<img src={imageAddAssignment.arrowDropDown} alt="Arrow Icon" />}
            clearable
            searchable
          />
        </div>
      </div>
    </form>
  );
}

export default AddAssignment;
