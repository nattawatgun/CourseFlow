import React, { useEffect } from 'react';
import classes from '../style/AddCourse.module.css';
import { useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Textarea, Button, FileButton, Text } from '@mantine/core';
import { addCourse } from '../data/images';
import { Table, rem } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconGripVertical } from '@tabler/icons-react';
import { imagesCourse } from '../data/images.js';
import handleFleUpload from '../utils/handleFileUpload.js';
import { useNavigate } from 'react-router-dom';
import useAxiosWithAuth0 from '../interceptor.js';
import { Puff } from 'react-loader-spinner';

function AddCourse ({lesson, setLesson, subLessons, setSubLessons, lessonData, setLessonData, toggleAddCoursePage}) {
  
  console.log(lessonData);

  const { axiosInstance } = useAxiosWithAuth0();
  const navigate = useNavigate();
  const [materialsId, _setMaterialsId] = useState(() => crypto.randomUUID());

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl]  = useState(null);
  const [isImageSizeError, setIsImageSizeError] = useState(false);
  const [coverImageSecureUrl, setCoverImageSecureUrl] = useState('');
  const [coverImagePublicId, setCoverImagePublicId] = useState('');
  // console.log(coverImageSecureUrl);
  // console.log(coverImagePublicId);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoSizeError, setIsVideoSizeError] = useState(false);
  const [videoTrailerSecureUrl, setVideoTrailerSecureUrl] = useState('');
  const [videoTrailerPublicId, setVideoTrailerPublicId] = useState('');
  // console.log(videoTrailerSecureUrl);
  // console.log(videoTrailerPublicId);
  const resetRefImage = useRef(null);
  const resetRefVideo = useRef(null);

  const [state, handlers] = useListState(lessonData);
  const [isLoading, setIsLoading] = useState(false);

  const createCourse = async (value) => {
    try {
      const courseData = {
        name: value.name,
        price: value.price,
        totalLearningTime: value.totalLearningTime,
        summary: value.summary,
        detail: value.detail,
        coverImageUrl: coverImageSecureUrl,
        coverImageResId: coverImagePublicId,
        videoTrailerUrl: videoTrailerSecureUrl,
        videoTrailerResId: videoTrailerPublicId,
        lessons: lessonData
      };
      // console.log(courseData);
      setIsLoading(true);
      const delaytime = 3000;
      const response = await axiosInstance.post('/course', courseData);
      console.log(response.data);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/course');
      }, delaytime);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleImageChange = async (file) => {
    // console.log(file);
    setImageFile(file);
    form.setFieldValue('imageFile', file);
    const maxFileSize = 5120; // 5MB
    const imageFileSize = file.size / 1024;
    if (imageFileSize > maxFileSize) {
      setIsImageSizeError(true);
      return;
    }
    else {
      const result = await handleFleUpload(materialsId, 'coverImg', file, axiosInstance);
      console.log(result);
      setIsImageSizeError(false);
      setCoverImageSecureUrl(result.data.secure_url);
      setCoverImagePublicId(result.data.public_id);
    }
  };

  const clearImageFile = () => {
    setImageFile(null);
    setImageUrl(null);
    setIsImageSizeError(false);
    form.setFieldValue('imageFile', null);
    if (resetRefImage.current) {
      resetRefImage.current();
    }
  };

  const handleVideoChange = async (file) => {
    // console.log(file);
    setVideoFile(file);
    form.setFieldValue('videoFile', file);
    const maxFileSize = 20480; //20MB
    const videoFileSize = file.size / 1024;
    if (videoFileSize > maxFileSize) {
      setIsVideoSizeError(true);
    }
    else {
      const result = await handleFleUpload(materialsId, 'trailerVideo', file, axiosInstance);
      console.log(result);
      setIsVideoSizeError(false);
      setVideoTrailerSecureUrl(result.data.secure_url);
      setVideoTrailerPublicId(result.data.public_id);
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setIsVideoSizeError(false);
    form.setFieldValue('videoFile', null);
    if (resetRefVideo.current) {
      resetRefVideo.current();
    }
  };

  useEffect(() => {
    if (imageFile) {
      const newImageUrl = URL.createObjectURL(imageFile);
      setImageUrl(newImageUrl);
    }
  },[imageFile]);

  useEffect(() => {
    if (videoFile) {
      const newVideoUrl = URL.createObjectURL(videoFile);
      setVideoUrl(newVideoUrl);
    }
  },[videoFile]);

  useEffect(() => {
    handlers.setState(lessonData);
    // console.log(lessonData);
    form.setFieldValue('lesson', lessonData);
  }, [lessonData]);

  const handleDeleteIcon = (id) => {
    // console.log(lessonData);
    // console.log(id);
    const filteredDeleteSubLessons = lessonData.filter((item, index) => index !== id);
    setLessonData(filteredDeleteSubLessons);
    // console.log(lessonData);
  };

  const form = useForm({
    initialValues: { name: '', price: '', totalLearningTime: '', summary: '', detail: '', imageFile: null, videoFile: null, lesson: [] },
    validate: {
      name: (value) => /^[a-zA-Z0-9. \s]+$/.test(value) ? null : 'Name must contain only letters and numbers',
      price: (value) => /^\d+(\.\d{1,2})?$/.test(value) ? null : 'Price must be a valid number with up to two decimal places',
      totalLearningTime: (value) => value > 0 ? null : 'Learning time must be greater than 0',
      summary: (value) => /^[a-zA-Z0-9., \s]+$/.test(value) ? null : 'Course Summary must contain only letters and numbers',
      detail: (value) => /^[a-zA-Z0-9.',: \s]+$/.test(value) ? null : 'Course Detail must contain only letters and numbers',
      imageFile: (value) => {
        if (!value) {
          return '*Please upload a cover image';
        } if (value.size > 5*1024*1024) {
          return '***Cover image size must be less than 5MB';
        }
        return null;
      },
      videoFile: (value) => {
        if (!value) {
          return '*Please upload a video';
        } if (value.size > 20*1024*1024) {
          return '***Video size must be less than 20MB';
        }
        return null;
      },
      lesson: (value) => {
        if (value.length < 1) {
          return '*Lesson must have atleast 1 lesson';
        }
        return null;
      }
    }
  });

  // Lesson Table with Drag'n drop
  const dragTable = state.map((item, index) => {
    const isLastItem = index === state.length - 1;
    const classNamesLeft = `${classes.dragTable} ${isLastItem ? classes.lastItemLeft : ''}`;
    const classNamesRight = `${classes.dragTable} ${isLastItem ? classes.lastItemRight : ''}`;
    return (
      <Draggable key={item.title} index={index} draggableId={item.title}>
        {(provided) => (
          <Table.Tr className={classes.dragTable} ref={provided.innerRef} {...provided.draggableProps}>
            <Table.Td style={{width: '41px', backgroundColor: 'white'}}  className={classNamesLeft}>
              <div className={classes.dragHandle} {...provided.dragHandleProps}>
                <IconGripVertical style={{ width: rem(18), height: rem(18), cursor: 'grab' }} stroke={1.5} />
              </div>
            </Table.Td>
            <Table.Td className='cf-body-2' style={{ height: '88px', width: '48px', backgroundColor: 'white' }}>{index+1}</Table.Td>
            <Table.Td className='cf-body-2' style={{ width: '500px', backgroundColor: 'white' }}>{item.title}</Table.Td>
            <Table.Td className='cf-body-2' style={{ width: '396px', backgroundColor: 'white' }}>{item.subLessons.length}</Table.Td>
            <Table.Td style={{ width: '120px', backgroundColor: 'white' }} className={classNamesRight}>
              <img src={imagesCourse.deleteIcon} alt='deleteIcon' style={{marginRight: '17px', cursor: 'pointer'}} onClick={()=> handleDeleteIcon(index)}/>
              <img src={imagesCourse.editIcon} alt='editIcon' />
            </Table.Td>
          </Table.Tr>
        )}
      </Draggable>
    );
  });

  return (
    <div>
      {/* Navbar: Header */}
      <div className={classes.courseBar}>
        <h3 style={{ color: 'var(--gray-900, #2A2E3F)' }}>Add Course</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className={classes.cancelButton} onClick={() => navigate('/course')}>
            <span className='cf-body-2' style={{ fontWeight: '700', color: 'var(--orange-500, #F47E20)' }}>Cancel</span>
          </button>
          <div>
            {isLoading && (
              <Puff
                visible={true}
                height="80"
                width="80"
                color="cornflowerblue"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            )}
          </div>
          {!isLoading && <button onClick={form.onSubmit(createCourse)} className={classes.createButton}>
            <span className='cf-body-2' style={{ fontWeight: '700', color: '#FFF' }}>Create</span>
          </button>}
        </div>
      </div>
      
      <div className={classes.background}>
        {/* Course Input section */}
        <div className={classes.inputCourseContainer}>
          <form className= {classes.form} encType='multipart/form-data'>
            <TextInput style={{width: '920px'}} label="Course name *" placeholder='Name your course here' {...form.getInputProps('name')} />
            <div style={{display: 'flex', flexDirection: 'row', gap: '40px'}}>
              <TextInput style={{width: '420px'}} label="Price *" placeholder='Input course price' {...form.getInputProps('price')} />
              <TextInput style={{width: '420px'}} label="Total learning time(hrs.) * " placeholder='Learning Time' {...form.getInputProps('totalLearningTime')} />
            </div>
            <Textarea style={{width: '920px'}} label="Course summary *" placeholder='Overall of your course' {...form.getInputProps('summary')} />    
            <Textarea style={{width: '920px'}} label="Course datail *" placeholder='Description your course' autosize minRows={4} {...form.getInputProps('detail')} />
            
            {/* FileButton image */}
            <div>
              <span className='cf-body-2'>Cover image *</span> <span className='cf-body-4' style={{color: 'grey', display: 'inline-flex', marginBottom: '10px', fontStyle: 'italic'}}>max-size: 5MB</span>
              <FileButton className={classes.fileInput} resetRef={resetRefImage} onChange={handleImageChange} accept='image/png, image/jpeg, image/jpg' disabled={imageFile} error={form.errors.imageFile}>
                {(props) => <Button {...props}>
                  <div>
                    {imageUrl ? null : (
                      <>
                        <img src={addCourse.add} style={{width: '24px', height: '24px'}} />
                        <p>Upload Image</p>
                      </>
                    )}
                    {imageUrl && <img src={imageUrl} alt='Image Upload' style={{width: '240px', height: '149px'}} />}
                  </div>
                </Button>}
              </FileButton>
              <div>
                {form.errors.imageFile && <span style={{ color: 'red' }}>{form.errors.imageFile}</span>}
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {isImageSizeError && <span className='cf-body-4' style={{color: 'red'}}>*Image size is more than maximum limit</span>}
              </div>
              {imageFile && (
                <Text size="sm" mt="sm" mb="sm">
                    Picked file: {imageFile.name}
                </Text>
              )}
              {imageFile && (
                <Button disabled={!imageFile} color="#9B2FAC" onClick={clearImageFile} style={{ width: 'fit-content' }}>
                Remove Image
                </Button>
              )}
            </div>

            {/* FileButton video */}
            <div>
              <span className='cf-body-2'>Video Trailer *</span> <span  className='cf-body-4' style={{color: 'grey', display: 'inline-flex', marginBottom: '10px', fontStyle: 'italic'}}>max-size: 20MB</span>
              <FileButton className={classes.fileInput} resetRef={resetRefVideo} onChange={handleVideoChange} accept='video/mp4, video/mov, video/avi' disabled={videoFile}  error={form.errors.imageFile}>
                {(props) => <Button {...props}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {videoUrl ? null : (
                      <>
                        <img src={addCourse.add} style={{width: '24px', height: '24px'}} />
                        <p>Upload Video</p>
                      </>
                    )}
                    {videoUrl && <video src={videoUrl} alt='Video Upload' style={{ width: '240px', height: '149px' }} controls/>}
                  </div>
                </Button>}
              </FileButton>
              <div>
                {form.errors.videoFile && <span style={{ color: 'red' }}>{form.errors.videoFile}</span>}
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {isVideoSizeError && <span  className='cf-body-4' style={{color: 'red'}}>*Video size is more than maximum limit</span>}
              </div>
              {videoFile && (
                <Text size="sm" mt="sm" mb='sm'>
                    Picked file: {videoFile.name}
                </Text>
              )}
              {videoFile && (
                <Button disabled={!videoFile} color="#9B2FAC" onClick={clearVideoFile} style={{ width: 'fit-content'}}>
                Remove Video
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Add lesson section */}
        {/* Add lesson Header */}
        <div className={classes.lessonHead}>
          <div>
            <h3>Lesson</h3>
            <div>
              {form.errors.lesson && <span style={{ color: 'red' }}>{form.errors.lesson}</span>}
            </div>
          </div>
          
          <button onClick={() => {toggleAddCoursePage();}} className={classes.addLessonButton}>
            <span className='cf-body-2' style={{ fontWeight: '700', color: '#FFF' }}>+Add Lesson</span>
          </button>
        </div>

        {/* Add lesson table Drag'n drop */}
        <div>
          <Table.ScrollContainer minWidth={420} style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
            <DragDropContext
              onDragEnd={({ destination, source }) =>
                handlers.reorder({ from: source.index, to: destination?.index || 0})
              }
            >
              <Table>
                <Table.Thead style={{ backgroundColor: '#E4E6ED' }}>
                  <Table.Tr>
                    <Table.Th style={{height: '41px', width: '56px' }} />
                    <Table.Th style={{ width: '48px' }} />
                    <Table.Th className='cf-body-3' style={{ width: '500px', color: 'var(--gray-800, #424C6B)' }}>Lesson name</Table.Th>
                    <Table.Th className='cf-body-3' style={{ width: '396px', color: 'var(--gray-800, #424C6B)' }}>Sub-lesson</Table.Th>
                    <Table.Th className='cf-body-3' style={{ width: '120px', color: 'var(--gray-800, #424C6B)' }}>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                  
                <Droppable droppableId='dnd-list' direction='vertical'>
                  {(provided) => (
                    <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {dragTable}
                      {provided.placeholder}
                    </Table.Tbody>
                  )}
                </Droppable>

              </Table>
            </DragDropContext>
          </Table.ScrollContainer>
          {(lessonData.length === 0 ) && <div style={{textAlign: 'center', marginTop: '60px', color: 'grey'}}>
            <h2>No Lesson</h2>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default AddCourse;