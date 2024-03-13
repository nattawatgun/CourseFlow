import { Paper, Accordion, NavLink, Grid, Text, Title, Group, Button, AccordionItem, Center } from '@mantine/core';
import CourseProgress from './CourseProgress';
import classes from '../../style/CourseViewer/CourseViewer.module.css';
import ProgressSymbol from '../../assets/course_progress/ProgressSymbol';
import { useEffect, useState } from 'react';
import fetchLessonsData from '../../utils/fetchLessonsData';
import fetchUserProgress from '../../utils/fetchUserProgress';
import updateVideoStatus from '../../utils/updateVideoStatus';
import CourseVideo from './CourseVideo';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import useAxiosWithAuth0 from '../../utils/interceptor';
import SublessonAssignment from './SublessonAssignment';
import { useListState } from '@mantine/hooks';

// Misc
// Use /learn/:courseId/:sublessonId to navigate to a specific sublesson
// By default, use the latest sublesson that the user has not completed

function CourseViewer() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [lessonsData, setLessonsData] = useState({});

  const [sublessonsStatus, setSublessonsStatus] = useState({});
  const [activeSublesson, setActiveSublesson] = useState(null);
  const [allAssignments, setAllAssignments] = useState([]); // all assignments, as fetched from the server
  const [sublessonsData, sublessonsDataHandlers] = useListState();
  const [sublessonAssignments, setSublessonAssignments] = useState([]);
  
  const [totalSublessons, setTotalSublessons] = useState(0);
  const [completedSublessons, setCompletedSublessons] = useState(0);
  
  const { courseId } = useParams();
  const { sublesson: querySublessonId } = useSearchParams();
  const { isAuthenticated } = useAuth0();
  const { axiosInstance } = useAxiosWithAuth0();

  // entry point of this page, the first steps
  useEffect(() => {
    setIsFetchingData(true);
    fetchLessonsData(courseId, axiosInstance)
      .then(lessonData => {
        setLessonsData(lessonData.data);
        console.log(lessonData.data.lessons);
        const allSublessons = lessonData.data.lessons.reduce((acc, lesson) => {
          return acc.concat(lesson.sublessons);
        },[]);
        sublessonsDataHandlers.setState(allSublessons);
        // count all sublessons for progress tracking.
        const sublessonsCount = lessonData.data.lessons.reduce((acc, lesson) => acc + lesson.sublessons.length, 0);
        setTotalSublessons(sublessonsCount);
        return fetchUserProgress(courseId, axiosInstance);
      })
      .then(progress => {
        // create a map of course progress for populating the sidebar.
        const sublessonStatus = {};
        const fetchedAssignments = []; 
        progress.data.forEach(progress => {
          const sublessonId = progress.sublesson.id;
          const userAssignments = progress.sublesson.UserAssignment;
          const videoCompletion = progress.videoCompletion;
          if (userAssignments.length === 0) {
            // If there are no assignments, check video completion status
            sublessonStatus[sublessonId] = videoCompletion === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS';
          } else {
            // If there are assignments, check if all of them were submitted
            const allAssignmentsSubmitted = userAssignments.every(homework => homework.isSubmitted);
            fetchedAssignments.push(...userAssignments); // add assignment entries to the array.
            console.log('pushed', userAssignments, 'to fetchedAssignments');
            sublessonStatus[sublessonId] = allAssignmentsSubmitted ? 'COMPLETED' : 'IN_PROGRESS';
          }
        });
        setSublessonsStatus(sublessonStatus);
        setAllAssignments(fetchedAssignments);
        // agian, for tracking course progress
        const completedCount = Object.values(sublessonsStatus).reduce((acc, status) => {
          return status === 'COMPLETED' ? acc + 1 : acc;
        }, 0);
        setCompletedSublessons(completedCount);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsFetchingData(false);
      });
  }, [isAuthenticated]);



  // Ideally, we will add a new key value to SublessonsStatus and push the changes automatically
  // TODO: Handle changes locally to improve responsiveness.
  useEffect(() => {
    const completedCount = Object.values(sublessonsStatus).reduce((acc, status) => {
      return status === 'COMPLETED' ? acc + 1 : acc;
    }, 0);
    setCompletedSublessons(completedCount);
  }, [sublessonsStatus]);

  function handleAssignmentRender(sublessonId) {
    const newAssignments = allAssignments.filter(assignment => assignment.sublessonId === sublessonId);
    setSublessonAssignments(newAssignments);
    console.log(sublessonAssignments);
  }

  function handleSublessonClick(sublessonId) {
    console.log('sublesson id', sublessonId, 'selected');
    const sublesson = sublessonsData.find(sublesson => sublesson.id === sublessonId);
    setActiveSublesson(sublesson);
    // to do .. handle assignment loading.
    handleAssignmentRender(sublesson.id);
    console.log(sublesson);
  }

  function handleStartVideo() {
    // prevent duplicate requests from being sent.
    if (sublessonsStatus[activeSublesson.id] !== 'IN_PROGRESS') {
      updateVideoStatus(activeSublesson.id, lessonsData.enrollmentId, 'IN_PROGRESS', Number(courseId), axiosInstance)
        .then((res) => {
          const { procedure } = res.data;
          if (procedure === 'mark-inprogress') {
            setSublessonsStatus(prevSublessonsStatus => ({ ...prevSublessonsStatus, [activeSublesson.id]: 'IN_PROGRESS' }));
          }
        })
        .catch(error => console.error('Failed to start video', error));
    } else {
      console.log('courseViewer: lesson is already in progress');
    }
  }
  
  function handleFinished() {
    updateVideoStatus(activeSublesson.id, lessonsData.enrollmentId, 'COMPLETED', Number(courseId),  axiosInstance)
      .then((res) => {
        console.log(res);
        const { procedure, assignments } = res.data;
        if (procedure === 'render-assignments') {
          // ... so this sets just a single sublesson, not all of them.
          setSublessonAssignments(assignments);
          setSublessonsStatus(prevSublessonsStatus => ({ ...prevSublessonsStatus, [activeSublesson.id]: 'IN_PROGRESS' }));
        } else if (procedure === 'mark-finished') {
          setSublessonsStatus(prevSublessonsStatus => ({ ...prevSublessonsStatus, [activeSublesson.id]: 'COMPLETED' }));
        } 
      })
      .catch(error => console.error('Failed to mark video as finished', error));
  }
  
  function AccordionLabel({ lessonTitle, lessonIdx }) {
    if (lessonIdx < 10) {
      lessonIdx = `0${lessonIdx}`;
    }
    return (
      <div className={classes.accordionLabel}>
        <Text c='#646D89'>{lessonIdx}</Text>
        <Text className={classes.accordionLessonTitle}>
          {lessonTitle}
        </Text>
      </div>
    );
  }

  const lessonsSidebar = lessonsData.lessons?.map((lesson, index) => {
    // these go inside each Accordion's panel.
    const sublessonsNavLink = lesson.sublessons.map((sublesson, index) => {
      const status = sublessonsStatus[sublesson.id] ?? 'NOT_STARTED';
      return (<NavLink 
        key={sublesson.id}
        active={sublesson.id === activeSublesson?.id}
        label={sublesson.title}
        leftSection={<ProgressSymbol status={status}/>}
        onClick={() => handleSublessonClick(sublesson.id)}
        c='#646D89'
      />); 
    });
    return (
      <Accordion.Item key={lesson.id} value={lesson.title}>
        <Accordion.Control>
          <AccordionLabel lessonTitle={lesson.title} lessonIdx={index+1}/>
        </Accordion.Control>
        <Accordion.Panel>{sublessonsNavLink}</Accordion.Panel>
      </Accordion.Item>
    );

  });

  const assignmentItems = sublessonAssignments.map((sa, index) => (
    <SublessonAssignment
      key={sa.id}
      userAssignment={sa}
      setSublessonsStatus={setSublessonsStatus}
      sublessonId={activeSublesson.id}
    />
  ));

  return (
    <main className={classes.courseViewer}>
      <Grid gutter="lg">
        <Grid.Col span={4}>
          <Paper className={classes.courseViewerSidebar} shadow="lg">
            <Text c='#F47E20'>Course</Text>
            <div className={classes.courseIntroContainer}>
              <Title className={classes.courseTitle}>{lessonsData.name}</Title>
              <Text className={classes.courseSummary}>{lessonsData.summary}</Text>
            </div>
            <CourseProgress
              totalSublessons={totalSublessons}
              totalCompleted={completedSublessons}
            />
            <Accordion className={classes.accordion} multiple>{lessonsSidebar}</Accordion>
          </Paper>
        </Grid.Col>
        <Grid.Col span={8}>
          {activeSublesson ? <section>
            <h2 className={classes.sublessonTitle}>{activeSublesson?.title}</h2>
            <div className={classes.sublessonVideoContainer}>
              {activeSublesson && (
                <CourseVideo
                  key={activeSublesson.id} 
                  publicId={activeSublesson.videoResId} // Assuming this is the dynamic part
                  id="sublesson-video"
                  width="640"
                  height="480"
                  handlePlay={handleStartVideo}
                  handleEnd={handleFinished}
                />
              )}
            </div>
            {/* <Group>
              <Button onClick={handleStartVideo}>Start Video</Button>
              <Button onClick={handleFinished}>Mark Finished</Button>
            </Group> */}
            {assignmentItems}
          </section> : 
            <Center className={classes.greetingBox}>
              <Text>Hi there, please select a lesson to start learning.</Text>
            </Center>}
        </Grid.Col>
      </Grid>
    </main>
  );
}
export default CourseViewer;