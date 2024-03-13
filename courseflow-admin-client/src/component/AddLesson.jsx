import classes from '../style/AddLesson.module.css';
import '@mantine/core/styles.css';
import {  Text  , FileButton, Button} from '@mantine/core';
import {addCourse} from '../data/images';
import { addLesson } from '../data/images';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function SubLesson (props){

  return(
    <div>
      <Text>Sub-lesson name *</Text>
      <input onChange={props.handleChange}/>

      {/* Insert video */}
      <div>
        <span className='cf-body-2'>Video *</span> 
        <FileButton className={classes.fileInput} resetRef={props.resetRefVideo} onChange={props.handleVideoChange} accept='video/mp4, video/mov, video/avi' disabled={props.videoFile}>
          {(props) => <Button {...props}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {props.videoUrl ? null : (
                <>
                  <img src={addCourse.add} style={{width: '24px', height: '24px'}} />
                  <p>Upload Video</p>
                </>
              )}
              {props.videoUrl && <video src={props.videoUrl} alt='Video Upload' style={{ width: '240px', height: '149px' }} controls/>}
            </div>
          </Button>}
        </FileButton>
        {props.isVideoSizeError && <span  className='cf-body-4' style={{color: 'red'}}>*Video size is more than maximum limit</span>}
        {props.videoFile && (
          <Text size="sm" mt="sm" mb='sm'>
                    Picked file: {props.videoFile.name}
          </Text>
        )}
        {props.videoFile && (
          <Button disabled={!props.videoFile} color="#9B2FAC" 
            onClick={props.clearVideoFile} 
            style={{ width: 'fit-content'}}>
                Remove Video
          </Button>
        )}
      </div>
            
      <button className={classes.deleteSubLessonButton} 
        onClick={(index)=>{props.deleteSubLesson(index);}} 
        disabled={props.subLessons.length===1} >Delete</button>
    </div>
          
  );     
}

function AddLesson ({lesson, setLesson, subLessons, setSubLessons, lessonData, setLessonData, toggleAddCoursePage}) {

  const [videoFile, setVideoFile] = useState(null);
  const resetRefVideo = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoSizeError, setIsVideoSizeError] = useState(false);
  const navigate = useNavigate();
  
  // const [lesson, setLesson] = useState('');

  // const [subLessons, setSubLessons] = useState([{id: 1, name: '', videoUrl: ''}]);
 
  // console.log(lesson);

  // subLessons ==> [1] ==> createLesson ==> push lessonData=[...subLessons, sublessons]


  // const lessonsData = [
  //   {
  //     title: 'Introduction to Philosophy of Technology',
  //     sublessons: [
  //       {
  //         title: 'Defining Technology and Its Impact',
  //         videoUrl: 'https://example.com/video21',
  //       },
  //       {
  //         title: 'Historical Perspectives on Technology',
  //         videoUrl: 'https://example.com/video22',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Why Technology',
  //     sublessons: [
  //       {
  //         title: 'Impact of Technology',
  //         videoUrl: 'https://example.com/video21',
  //       },
  //       {
  //         title: 'All People Seems to Need Data Processing',
  //         videoUrl: 'https://example.com/video22',
  //       },
  //     ],
  //   },
  // ];

  const handleCreateLesson = () => {
    const maxId = subLessons.reduce((acc, subLesson) => Math.max(acc,subLesson.index),0);
    const newLesson = {
      title: lesson,
      subLessons: subLessons
    };
    console.log(newLesson);
    setLessonData([...lessonData, newLesson]);
    toggleAddCoursePage();
    setLesson('');
    setSubLessons([{
      index: maxId +1,
      title: '',
      videoUrl: ''
    }]);
  };

  const addSubLesson = ()=>{
    const maxId = subLessons.reduce((acc, subLesson) => Math.max(acc,subLesson.index),0);
    
    const newSubLesson = {
      index: maxId +1,
      title: '',
      videoUrl: ''
    };
    setSubLessons([...subLessons, newSubLesson]);
  };

  const deleteSubLesson = (index) => {
    const updatedSubLesson = subLessons.filter(subLesson => subLesson.index !== index);
    setSubLessons(updatedSubLesson);
  };

  const handleChange= (id,value) => {
    const updatedSubLesson = subLessons.map((subLesson)=>{
      if(subLesson.id === id){
        return {...subLesson, title: value};
      }
      return subLesson;
    });
    setSubLessons(updatedSubLesson);
  };


  const handleVideoChange = (video) => {
    setVideoFile(video);
    const maxFileSize = 20480; //20MB
    const videoFileSize = video.size / 1024;
    setIsVideoSizeError(false);
    if (videoFileSize > maxFileSize) {
      setIsVideoSizeError(true);
    }
  };
  
  const clearVideoFile = () => {
    setVideoFile(null);
    setVideoUrl(null);
    if (resetRefVideo.current) {
      resetRefVideo.current();
    }
  };

  function Navbar (){
    const [lessonDataForFetch, setLessonDataForFetch] = useState([]);

    const fetchingData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/course/1`);
        setLessonDataForFetch(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchingData();
    },[]);
    return (
      <div>
        <div className={classes.headerBar}>
          <div className={classes.courseBar}>
            <img src={addLesson.backIcon} alt="arrow back" onClick={()=>{
              toggleAddCoursePage();
            }} style={{cursor:'pointer'}} />
            <div>
              <span className='cf-body-3' style={{color: 'var(--gray-600, #9AA1B9)'}}>Course </span>
              <span className='cf-body-3'>{lessonDataForFetch.name}</span>
              <h3 style={{ color: 'var(--gray-900, #2A2E3F)', margin:'0' }}>Add Lesson</h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <button className={classes.cancelButton} onClick={()=> toggleAddCoursePage()}>
              <span className='cf-body-2' style={{ fontWeight: '700', color: 'var(--orange-500, #F47E20)' }}>Cancel</span>
            </button>          
            <button className={classes.createButton} onClick={handleCreateLesson}>
              <span className='cf-body-2' style={{ fontWeight: '700', color: '#FFF' }} >Create</span>
            </button>
          </div>
        </div>
      </div>
    ); 
  }
  return (
    <div>
      <div className={classes.addLessonContainer}>
        <Navbar />
        <div className={classes.background}>      
          <div className={classes.addLessonContent}>
            <div className={classes.lessonDetails}>   
              <div className={classes.subLessonDetails}>
                <Text weight="bold" >Lesson name *</Text>
                <input onChange={(e)=>{
                  setLesson(e.target.value);
                }}
                value={lesson}/>
                <hr style={{width:'100%', marginTop:'30px' ,marginBottom:'0px' }} />
              </div>
            </div>
            <p className={classes.subLesson}>Sub-Lesson</p>
            <div>
              {subLessons.map((subLesson)=>{
                return(
                  <SubLesson 
                    key={subLesson.index}
                    handleChange={(e)=>{
                      handleChange(subLesson.id, e.target.value);
                    }}
                    lesson={lesson}
                    handleVideoChange={handleVideoChange}
                    videoFile={videoFile}
                    videoUrl={videoUrl}
                    isVideoSizeError={isVideoSizeError}
                    clearVideoFile={clearVideoFile}
                    resetRefVideo={resetRefVideo}
                    deleteSubLesson={()=>deleteSubLesson(subLesson.index)}
                    subLessons={subLessons}
                  />
                );
              }
                
              )}
              

            </div>
            <button type='button' className={classes.addSubLessonButton} onClick={addSubLesson}>
              <span className='cf-body-2' style={{ fontWeight: '700', color: 'var(--orange-500, #F47E20)' }}>+ Add  Sub-lesson</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddLesson;