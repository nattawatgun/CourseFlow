import classes from '../style/CourseCard.module.css';
import lessonIcon from '../images/imagesCourseCard/lessonIcon.svg';
import hoursIcon from '../images/imagesCourseCard/hoursIcon.svg';

function CourseCard( { detailCourse }) {
  
  const totalLesson = detailCourse._count?.lessons ? detailCourse._count.lessons : detailCourse.totalLessons;

  return (
    <div key={detailCourse.id} className={classes.courseCard}>
      <img src={detailCourse.coverImageUrl} alt={detailCourse.name} className={classes.imgCourseCard} width='357' height='240' />
      <div className={classes.textCourseCard}>
        <p className='cf-body-3' style={{ color: '#F47E20' , fontWeight: '400', lineHeight: '0' }}>Course</p>
        <h3 style={{ lineHeight: '1' }}>{detailCourse.name}</h3>
        <p className='cf-body-2' style={{ color: '#646D89', lineHeight: '1' }} >{detailCourse.summary}</p>
      </div>   
      <div className={classes.footerCourseCard}> 
        <div className={classes.detailFooterCourseCard}>
          <img src={lessonIcon} alt='lessonIcon' />
          <span className='cf-body-2'>{totalLesson} Lesson</span>
        </div>
        <div className={classes.detailFooterCourseCard}>
          <img src={hoursIcon} alt='hoursIcon' />
          <span className='cf-body-2'>{detailCourse.totalLearningTime} Hours</span>
        </div>
      </div>   
    </div>
  );
}

export default CourseCard;