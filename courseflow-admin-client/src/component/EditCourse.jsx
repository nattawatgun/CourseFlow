import React, { useState, useEffect } from 'react';
import useAxiosWithAuth0 from '../interceptor.js';
import { useParams, useNavigate } from 'react-router-dom';
import navClasses from '../style/AddAssignment.module.css';
import classes from '../style/EditCourse.module.css';
import { useForm } from '@mantine/form';
import { TextInput, Textarea, Button, FileButton, Text, Group, Title } from '@mantine/core';
import { addCourse } from '../data/images';
import { Table } from '@mantine/core';
import { useListState, useToggle } from '@mantine/hooks';
import { imagesCourse } from '../data/images.js';
import handleFleUpload from '../utils/handleFileUpload.js';
import { addLesson } from '../data/images.js';
import { useAuth0 } from '@auth0/auth0-react';
import Uploader from './Uploader.jsx';
import CldVideoPlayer from './CldVideoPlayer.jsx';
import courseValidationRules from '../utils/validateCourseData.js';
import EditCourseLesson from './EditCourseLesson.jsx';

function EditCourse () {

  const { axiosInstance } = useAxiosWithAuth0();
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [materialsId, setMaterialsId] = useState('');

  const [courseData, setCourseData] = useState();
  const [lessons, lessonsHandlers] = useListState(); // initialized in getCourseDetailsById
  const [showEditPage, toggleShowEditPage] = useToggle();
  const [activeLessonIndex, setActiveLessonIndex] = useState(null);
  const [deletedLessons, deletedLessonsHandlers] = useListState();
  const [deletedSublessons, deletedSublessonsHandlers] = useListState();

  async function getCourseDetailsById()  {
    try {
      const response = await axiosInstance.get(`/admin/course/${params.courseId}`);
      console.log(response.data);
      // transform incoming data into appropriate object structure.
      const {name, detail, summary, price, totalLearningTime, materialsId} = response.data;
      setMaterialsId(materialsId);
      const coverImg = {
        url: response.data.coverImageUrl,
        publicId: response.data.coverImageResId
      };
      const trailerVid = {
        url: response.data.videoTrailerUrl,
        publicId: response.data.videoTrailerResId
      };
      // initialize the form here
      form.initialize({name, detail, summary, price, totalLearningTime, coverImg, trailerVid});
      setCourseData(response.data);
      lessonsHandlers.setState(response.data.lessons);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleSubmit(value) {
    const data = {id: courseData.id, ...value, lessons, deletedLessons, deletedSublessons};
    
    try {
      const updateResult = await axiosInstance.put('/admin/course', data);
      console.log(updateResult);
      navigate('/course');
    } catch (error) {
      console.error(error);
      window.alert('Error updating the course. Please contact the IT department.');
    }
    

  }

  function deleteLesson(idx) {
    if (lessons[idx].id) {
      deletedLessonsHandlers.append(lessons[idx].id);
    }
    lessonsHandlers.remove(idx);
    lessonsHandlers.apply((lesson, idx) => ({...lesson, index: (idx+1)}));
  }

  function launchLessonEditor(lessonId) {
    setActiveLessonIndex(lessonId);
    toggleShowEditPage();
  }

  const lessonsRows = lessons.map((lesson, idx) => {
    return (
      <Table.Tr key={lesson.id}>
        <Table.Td>{idx+1}</Table.Td>
        <Table.Td>{lesson.title}</Table.Td>
        <Table.Td>{lesson.sublessons.length}</Table.Td>
        <Table.Td>
          <Group>
            <button onClick={() => deleteLesson(idx)}>
              <img src={imagesCourse.deleteIcon} alt='trash icon'/>
            </button>
            <button onClick={() => launchLessonEditor(idx)}>
              <img src={imagesCourse.editIcon} alt='edit icon' />
            </button>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  function handleDelete(materialType) {
    if (materialType === 'coverImg') {
      form.setFieldValue('coverImg', {
        url: '',
        publicId: '',
      });
      // also delete from Cloudinary, using the preivous ID (don't delete yet!)
    }
    else if (materialType === 'trailerVid') {
      form.setFieldValue('trailerVid', {
        url: '',
        publicId: '',
      });
    }
  }

  useEffect(() => {
    getCourseDetailsById();
  },[]);


  const form = useForm({
    initialValues: {
      name: '',
      price: '',
      totalLearningTime: '',
      summary: '',
      detail: '',
      coverImg: {
        url: '',
        publicId: '',
      },
      trailerVid: {
        url: '',
        publicId: ''
      },
    },
    validate: courseValidationRules
  });

  
  if (!showEditPage) {
    return ( 
      <div>
        <div className={navClasses.navbar}>
          <h3>Course {courseData?.name}</h3>
          <div className={navClasses.leftNavbar}>
            <button onClick={() => navigate('/course')} className={navClasses.buttonCancel}>
              <p className='cf-body-2' style={{fontWeight: '700'}}>Cancel</p>
            </button>
            <button className={navClasses.button} onClick={form.onSubmit(handleSubmit)}>
              <p className='cf-body-2' style={{fontWeight: '700'}}>Save Edits</p>
            </button>
          </div>
        </div>
  
        <section className={classes.form}>
          <form>
            <TextInput
              withAsterisk
              label='Course name'
              placeholder='Best Course Ever'
              {...form.getInputProps('name')}
            />
            <Group className={classes.duoTextInput}>
              <TextInput
                withAsterisk
                label='Price'
                placeholder='In Thai Baht'
                {...form.getInputProps('price')}
              />
              <TextInput
                withAsterisk
                label='Total learning time'
                placeholder='How long does it take?'
                {...form.getInputProps('totalLearningTime')}
              />
            </Group>
            <Textarea
              withAsterisk
              label='Course summary'
              placeholder="What's the gist of this course"
              maxRows={2}
              {...form.getInputProps('summary')}
            />
  
            <Textarea
              withAsterisk
              label='Course detail'
              placeholder='e.g. What is it about? Who is it for?'
              autosize
              minRows={6}
              maxRows={8}
              {...form.getInputProps('detail')}
            />
            {/* if there's no content in the form, render the Uploader */}
            <label htmlFor='coverImg'>Cover Image</label>
            { !form.getInputProps('coverImg').value.url ? (
              <Uploader
                label='Upload image'
                materialType='coverImg'
                materialsId={materialsId}
                onUpload={(data) => form.setFieldValue('coverImg', data)}
                onError={(error) => form.setFieldError('coverImg', error)}
                maxSize={5}
                allowedTypes={['image/jpg', 'image/jpeg', 'image/png', 'image/webp']}
              />) : (
              <div key={form.getInputProps('coverImg').value.publicId}>
                <div>
                  <img src={form.getInputProps('coverImg').value.url} width='300px' />
                </div>
                <Button 
                  color='red'
                  onClick={() => handleDelete('coverImg')}
                >
                  Delete image
                </Button>
              </div>
            )}
            
  
            <label htmlFor='trailerVid'>Video Trailer</label>
            {!form.getInputProps('trailerVid').value.publicId ? <Uploader
              label='Upload video'
              materialType='trailerVid'
              materialsId={materialsId}
              onUpload={(data) => form.setFieldValue('trailerVid', data)}
              onError={(error) => form.setFieldError('trailerVid', error)}
              maxSize={20}
              allowedTypes={['video/quicktime', 'video/x-msvideo', 'video/mp4']}
            /> : (
              <>
                <CldVideoPlayer
                  key={form.getInputProps('trailerVid').value.publicId}
                  publicId={form.getInputProps('trailerVid').value.publicId}
                  width='320px'
                />
                <Button 
                  color='red'
                  onClick={() => handleDelete('coverImg')}
                >Delete video
                </Button>
              </>
   
            )}
          </form>
      
        </section>
  
        <section className={classes.lessonsTable}>
          <Group justify='space-between'>
            <Title fw={500}>Lesson</Title>
            <button className={navClasses.button} type='onSubmit'>
              + Add Lessons
            </button>
          </Group>
          {/* prep the lessons table */}
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>&nbsp;</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Sublessons</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{lessonsRows}</Table.Tbody>
          </Table>
        </section>
        
      </div>
    );
  } else {
    return (
      <EditCourseLesson 
        key={lessons[activeLessonIndex].id}
        lessonData={lessons}
        lessonsHandlers={lessonsHandlers}
        lessonIndex={activeLessonIndex}
        courseData={courseData}
        closeEditPage={toggleShowEditPage}
        deletedSublessonsHandlers={deletedSublessonsHandlers}
      />
    );
  }
  
}

export default EditCourse;