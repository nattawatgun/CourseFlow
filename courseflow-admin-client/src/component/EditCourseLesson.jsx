import { Text, Stack, TextInput, Button, Group } from '@mantine/core';
import navClasses from '../style/AddAssignment.module.css';
import classes from '../style/EditCourseLesson.module.css';
import { useInputState, useListState } from '@mantine/hooks';
import Uploader from './Uploader';
import { useState, useEffect } from 'react';

function SublessonBox({sublessonIndex, sublessonsHandlers, sublessonData = {}, materialsId, deletedSublessonsHandlers = {}}) {
  const [sublessonNameValue, setSublessonNameValue] = useInputState(sublessonData?.title);
  const [uploadError, setUploadError] = useState(null);
  console.log('sublesson data', sublessonData);
  // handle previously uploaded sublesson here how to render, how to replace, etc.

  // on upload -- how does it work .. what do I have to set?
  function handleDelete(index) {
    // remove the sublesson from the list

    sublessonsHandlers.remove(index);
    // take note of fetched sublessons for backend deletion (fetched sublessons have ids)
    if (sublessonData.id) {
      deletedSublessonsHandlers.append(sublessonData.id);
    }
    // reorder the index
    sublessonsHandlers.apply((sublesson, idx) => ({...sublesson, index: (idx+1)}));
  }

  function handleVideoUpload(index, cldResponse) {
    console.log(cldResponse);
    const {url, publicId} = cldResponse;
    sublessonsHandlers.setItem(index, {...sublessonData, videoUrl: url, videoResId: publicId});
    return; 
  }

  function handleTitleChange(index, event) {
    const newTitle = event.target.value;
    setSublessonNameValue(newTitle);
    sublessonsHandlers.setItem(index, {...sublessonData, title: newTitle});
  }

  useEffect(() => {
    setSublessonNameValue(sublessonData.title);
  }, [sublessonData]);


  return (
    <div className={classes.sublessonBox}>
      <Group className={classes.inputDeleteDuo}>
        <TextInput
          withAsterisk
          label='Lesson name'
          value={sublessonNameValue}
          onChange={(event) => handleTitleChange(sublessonIndex, event)}
        />
        <Button bg='red' onClick={() => handleDelete(sublessonIndex)}>Delete</Button>
      </Group>

      <Uploader
        label='Upload video'
        materialType='sublessonVid'
        materialsId={materialsId}
        onUpload={(data) => handleVideoUpload(sublessonIndex, data)}
        onError={(error) => setUploadError(error)}
        maxSize={20}
        allowedTypes={['video/quicktime', 'video/x-msvideo', 'video/mp4']}
      />
      <Text c='red'>{uploadError}</Text>
    </div>

  );
}

function EditCourseLesson({lessonData, lessonsHandlers, lessonIndex, courseData, closeEditPage, deletedSublessonsHandlers}) {
  
  const [sublessons, sublessonsHandlers] = useListState(lessonData[lessonIndex].sublessons);
  console.log(sublessons);
  const [sublessonsError, setSublessonsErrors] = useState({});
  const [lessonNameValue, setLessonNameValue] = useInputState(lessonData[lessonIndex].title);

  function handleClose() {
    setSublessonsErrors({});
    deletedSublessonsHandlers.setState([]);
    closeEditPage();
  }

  function handleSave() {
    setSublessonsErrors({});
    // save added/edited sublessons
    lessonsHandlers.setItem(lessonIndex, {...lessonData[lessonIndex], sublessons});
    closeEditPage();
  }

  function addEmptySublesson() {
    const prevIndex = sublessons[sublessons.length - 1].index;
    const nextIndex = prevIndex + 1;
    const emptySublesson = {title: '', videoUrl: '', videoResId: ''};
    sublessonsHandlers.append({...emptySublesson, index: nextIndex});
  }

  function validateSublessons() {
    // add index as key and errors as values to sublessonsError
    // validate each each sublessons for empty title/video
    // pass the error to the sublesson box
  }


  const sublessonElements = sublessons.map((sl, idx) => (
    <SublessonBox
      key={sl.index}
      sublessonIndex={idx}
      sublessonData={sl}
      sublessonsHandlers={sublessonsHandlers}
      deletedSublessonsHandlers={deletedSublessonsHandlers}
      materialsId={courseData.materialsId}
    />));

  return (
    <div>
      <div className={navClasses.navbar}>
        <div className={classes.navTitles}>
          <Text><span className={classes.accentTitle}>Course</span> &lsquo;{courseData.name}&rsquo;</Text>
          <h3>Lesson &lsquo;{lessonData[lessonIndex].title}&rsquo;</h3>
        </div>
        
        <div className={navClasses.leftNavbar}>
          <button className={navClasses.buttonCancel} onClick={handleClose}>
            <p className='cf-body-2' style={{fontWeight: '700'}}>Cancel</p>
          </button>
          <button className={navClasses.button} onClick={handleSave}>
            <p className='cf-body-2' style={{fontWeight: '700'}}>Save Edits</p>
          </button>
        </div>
      </div>

      <section className={classes.lessonEditor}>
        <TextInput
          withAsterisk
          label='Lesson name'
          value={lessonNameValue}
          onChange={setLessonNameValue}
        />
        <hr className={classes.splitLine} />
        <h3>Sublessons</h3>
        {sublessonElements}
        <Button bg='orange' onClick={addEmptySublesson}> + Add Sublesson</Button>
      </section>
    </div>
  );
}
export default EditCourseLesson;