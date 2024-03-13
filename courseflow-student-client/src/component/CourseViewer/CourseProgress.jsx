import { Text, Box } from '@mantine/core';
import classes from '../../style/CourseViewer/CourseProgress.module.css';
function CourseProgress({ totalSublessons, totalCompleted }) {
  const progress = totalSublessons ? (totalCompleted / totalSublessons) * 100 : 0;
  return (
    <Box>
      <Text c='#646D89' fw={400}>{ Number.isNaN(progress) ? 0 : progress}% Complete</Text>
      <div className={classes.courseProgressBar}>
        <div className={classes.courseProgressLine} style={{ width: `${progress}%` }}></div>
      </div>
    </Box>
  );
}
export default CourseProgress;