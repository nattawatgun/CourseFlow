import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, TextInput, Modal } from '@mantine/core';
import axios from 'axios';
import classes from '../style/EditAssignment.module.css';
import { imageEditAssignment } from '../data/images';
import { useDisclosure } from '@mantine/hooks';

function EditAssignment() {
  const navigate = useNavigate();
  const [dataAssignmentById, setDataAssignmentById] = useState();
  const [dataAssignment, setDataAssignment] = useState([]);
  const [course, setCourse] = useState('');
  const [lesson, setLesson] = useState('');
  const [lessons, setLessons] = useState([]);
  const [subLesson, setSubLesson] = useState('');
  const [subLessons, setSubLessons] = useState([]);
  const [subLessonId, setSubLessonId] = useState();
  const [assignment, setAssignment] = useState('');
  const [duration, setDuration] = useState();
  const [durationValue, setDurationValue] = useState();
  const [assignmentHeader, setAssignmentHeader] = useState();
  const [opened, { open, close }] = useDisclosure(false);

  const params = useParams();

  const getAssignment = async () => {
    try {
      const result = await axios.get(import.meta.env.VITE_API_SERVER + '/course/detail/test');
      setDataAssignment(result.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };
 
  const getAssignmentById = async () => {
    try {
      const result = await axios.get(import.meta.env.VITE_API_SERVER + `/assignment/${params.assignmentId}`);
      setDataAssignmentById(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteAssignment = async() => {
    try {
      await axios.delete(import.meta.env.VITE_API_SERVER + `/assignment/${params.assignmentId}/delete`);
    } catch (error) {
      console.log(error);
    }
  };

  const editAssignment = async(data) => {
    try {
      await axios.put(import.meta.env.VITE_API_SERVER + `/assignment/${params.assignmentId}/edit` ,data);
    } catch(error) {
      console.log(error);
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    editAssignment({
      assignment,
      duration,
      subLessonId
    });
    navigate('/assignment');
  };
 
  useEffect(() => {
    getAssignmentById();
    getAssignment();
    console.log(dataAssignment);
  }, []);

  useEffect(() => {
    if(dataAssignmentById) {
      setCourse(dataAssignmentById.sublesson.lesson.course.name);
      setSubLesson(dataAssignmentById.sublesson.title);
      setLesson(dataAssignmentById.sublesson.lesson.title);
      setAssignment(dataAssignmentById.title);
      setSubLessonId(dataAssignmentById.sublesson.id);
      setDurationValue(dataAssignmentById.duration===null ? '' : dataAssignmentById.duration<=1 ? dataAssignmentById.duration + ' day' :  dataAssignmentById.duration + ' days');
      setDuration(dataAssignmentById.duration);
      setAssignmentHeader(dataAssignmentById.title);
    }
  }, [dataAssignmentById]);

  useEffect(() => {
    findLesson();
    findSubLesson();
  }, [course, lesson]);

  const handleChangeCourse = (event) => {
    setLesson('');
    setSubLesson('');
    setCourse(event);
  };

  const handleChangeLesson = (event) => {
    setSubLesson('');
    setLesson(event);
  };

  const handleChangeSubLesson = (event) => {
    setSubLesson(event);
    const subLessonId = subLessons.filter((lesson) => lesson.title === event);
    setSubLessonId(subLessonId[0].id);
  };

  const handleChangeDuration = (event) => {
    const numberDuration = event.split('');
    setDuration(numberDuration[0]);
    setDurationValue(event);
  };

  const findLesson = () => {
    const findCourse = dataAssignment.filter((courses) => courses.name === course);
    console.log(findCourse);
    if (findCourse.length > 0) {  
      const lessonsForSelectedCourse = findCourse[0].lessons;
      setLessons(lessonsForSelectedCourse);
    }
  };

  const findSubLesson = () => {
    const findLesson = lessons.filter((lessons) => lessons.title === lesson);
    
    if (findLesson.length > 0) {
      const subLessonForSelectedLesson = findLesson[0].sublessons;
      setSubLessons(subLessonForSelectedLesson);
      console.log(subLessonForSelectedLesson);
    } else {
      setSubLessons([]);
    }
  };

  const handleClickDelete = () => {
    deleteAssignment();
    navigate('/assignment');
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Confirmation" radius='lg' size='480' shadow centered>
        <div className={classes.underlineModal}></div>
        <p className='cf-body-2' style={{color: '#646D89'}}>Are you sure you want to delete this assignment?</p>
        <div className={classes.buttonComponent}>
          <button className={classes.buttonConfirmDelete}>
            <p className='cf-body-2' style={{fontWeight: '700'}} onClick={() => {handleClickDelete();}}>Yes, I want to delete the assignment</p>
          </button>
          <button className={classes.buttonCancelModal} onClick={close}>
            <p className='cf-body-2' style={{fontWeight: '700'}}>No, keep it</p>
          </button>
        </div>
      </Modal>
      <form onSubmit={handleOnSubmit}> 
        <div className={classes.navbar} >
          <div className={classes.headNavbar}>
            <div className={classes.textHeadNavbar}>
              <img src={imageEditAssignment.arrowBack} alt='arrowBack' className={classes.iconBack} onClick={() => {navigate('/assignment');}} />
              <h3>Assignment </h3>
            </div>
            <h3>{assignmentHeader}</h3>
          </div>       
          <div className={classes.leftNavbar}>
            <button onClick={() => {navigate('/assignment');}} className={classes.buttonCancel}>
              <p className='cf-body-2' style={{fontWeight: '700'}}>Cancel</p>
            </button> 
            <button className={classes.button}>
              <p className='cf-body-2' style={{fontWeight: '700'}}>Save</p>
            </button>
          </div>  
        </div>
        <div className={classes.mainContainer} >
          <div className={classes.container}>
            <Select 
              label='Course' 
              size='md' 
              placeholder='Select Course' 
              className={classes.select} 
              data={dataAssignment.map((course) => course.name)} 
              searchValue={course} 
              value={course}
              onChange={handleChangeCourse} 
              rightSectionPointerEvents="none"
              rightSection={<img src={imageEditAssignment.arrowDropDown} alt="Arrow Icon" />}
              required
              clearable
              searchable
            />
            <div className={classes.selectInContainer}>
              <Select 
                label='Lesson' 
                size='md' 
                placeholder='Select Lesson' 
                className={classes.select} 
                disabled={!course}
                searchValue={lesson} 
                value={lesson} 
                data={lessons.map((lesson) => lesson.title)} 
                onChange={handleChangeLesson} 
                rightSectionPointerEvents="none"
                rightSection={<img src={imageEditAssignment.arrowDropDown} alt="Arrow Icon" />}
                required
                clearable
                searchable
              />
              <Select 
                label='Sub-Lesson' 
                size='md' 
                placeholder='Select Sub-Lesson' 
                className={classes.select}
                disabled={!lesson}
                searchValue={subLesson} 
                data={subLessons.map((subLesson) => subLesson.title)} 
                value={subLesson} 
                onChange={handleChangeSubLesson} 
                rightSectionPointerEvents="none"
                rightSection={<img src={imageEditAssignment.arrowDropDown} alt="Arrow Icon" />}
                required
                clearable
                searchable
              />
            </div>
            <div className={classes.underline}></div>
            <p className='cf-body-1' style={{ fontWeight: '600', color: '#646D89' }}>Assignment detail</p>
            <TextInput 
              label='Assignment' 
              size='md' 
              placeholder='Please Input Assignment' 
              value={assignment} 
              onChange={(e) => {setAssignment(e.target.value);}} 
              required
            />
            <Select 
              label='Duration of assignment (day)' 
              placeholder='Select Duration of assignment (day)' 
              size='md' className={classes.select} 
              data={['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days']} 
              searchValue={durationValue} 
              value={durationValue}
              onChange={handleChangeDuration} 
              rightSectionPointerEvents="none"
              rightSection={<img src={imageEditAssignment.arrowDropDown} alt="Arrow Icon" />}
              clearable
              searchable
            />
          </div>
        </div>
        <div className={classes.deleteBox} onClick={open}>
          <p className='cf-body-2' style={{fontWeight: '700'}}>Delete Assignment</p>
        </div>
      </form>
    </>
  );

 
}

export default EditAssignment;




    
