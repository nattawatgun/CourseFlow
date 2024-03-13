import { useEffect, useState } from 'react';
import classes from '../style/Assignment.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { imageAssignment } from '../data/images';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

function Assignment() {
  const navigate = useNavigate();
  const [dataAssignment, setDataAssignment] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [assignmentId, setAssignmentId] = useState('');
  const [debounced] = useDebouncedValue(keywords, 200);

  const getDataAssignment = async(keyword) => {
    try {
      const result = await axios.get(import.meta.env.VITE_API_SERVER+'/assignment', {
        params: {
          keywords: keyword
        }
      });
      setDataAssignment(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const deleteAssignment = async(assignmentId) => {
    try {
      await axios.delete(import.meta.env.VITE_API_SERVER+`/assignment/${assignmentId}/delete`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (event) => {
    setKeywords(event);
  };

  const handleClickDelete = () => {
    deleteAssignment(assignmentId);
    const newDataAssignment = dataAssignment.filter((id) => id.id !== assignmentId);
    setDataAssignment(newDataAssignment);
  };

  const handleClickModal = (id) => {
    setAssignmentId(id);
  };

  useEffect(() => {
    getDataAssignment(debounced);
  },[debounced]);

  useEffect(() => {
    console.log(debounced);
  },[]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Confirmation" radius='lg' size='480' shadow centered>
        <div className={classes.underline}></div>
        <p className='cf-body-2' style={{color: '#646D89'}}>Are you sure you want to delete this assignment?</p>
        <div className={classes.buttonComponent}>
          <button className={classes.buttonConfirmDelete}>
            <p className='cf-body-2' style={{fontWeight: '700'}} onClick={() => {handleClickDelete(); close();}}>Yes, I want to delete the assignment</p>
          </button>
          <button className={classes.buttonCancel} onClick={close}>
            <p className='cf-body-2' style={{fontWeight: '700'}}>No, keep it</p>
          </button>
        </div>
      </Modal>
      <div> 
        <div className={classes.navbar} >
          <h3 style={{ color: '#2A2E3F' }}>Assignments</h3>
          <div className={classes.leftNavbar}> 
            <input className={classes.searchBox} onChange={(e) => {handleChangeSearch(e.target.value);}}  type='text' placeholder='Search...' />
            <button onClick={() =>{navigate('/assignment/add');}} className={classes.button}>
              <p className='cf-body-2' style={{fontWeight: '700'}}>
                + Add Assignment
              </p>       
            </button>
          </div>  
        </div>
        <div className={classes.mainContainer} >
          <div className={classes.assignmentMainContainer}>
            <div className={classes.headerAssignment}>     
              <div className={classes.assignmentDetailContainer}>
                <p className='cf-body-3'>Assignment Detail</p>  
              </div>
              <div className={classes.courseContainer}>
                <p className='cf-body-3'>Course</p>
              </div>
              <div className={classes.lessonContainer}>
                <p className='cf-body-3'>Lesson</p>  
              </div>
              <div className={classes.subLessonContainer}>
                <p className='cf-body-3'>Sup-lesson</p>  
              </div>
              <div className={classes.createdAtContainer}>
                <p className='cf-body-3'>Created-date</p>
              </div>  
              <div className={classes.iconBox}>
                <p className='cf-body-3'>Action</p>
              </div>
            </div>
            <div>
              {
                dataAssignment.map((items, index) => {
                  return (
                    <>
                      <div className={classes.assignmentDetail} key={index}>
                        <div className={classes.assignmentDetailContainer}>
                          <p className='cf-body-2'>{items.title}</p>
                        </div>
                        <div className={classes.courseContainer}>
                          <p className='cf-body-2'>{items.sublesson.lesson.course.name}</p>
                        </div>
                        <div className={classes.lessonContainer}>
                          <p className='cf-body-2'>{items.sublesson.lesson.title}</p>
                        </div>
                        <div className={classes.subLessonContainer}>
                          <p className='cf-body-2'>{items.sublesson.title}</p>
                        </div>
                        <div className={classes.createdAtContainer}>
                          <p className='cf-body-2'>{items.createdAt}</p>
                        </div>  
                        <div className={classes.iconBox}>
                          <img src={imageAssignment.deleteIcon} alt='deleteIcon' className={classes.icon} onClick={() => { open(); handleClickModal(items.id); }} />
                          <img src={imageAssignment.editIcon} alt='editIcon' onClick={() => {navigate(`/assignment/edit/${items.id}`);}} className={classes.icon} />
                        </div>
                      </div>
                    </>
                  );    
                })
              }     
            </div>
          </div>
        </div>
      </div>  
    </>
    
  );
}

export default Assignment;