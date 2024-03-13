import { useNavigate } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';
import classes from '../style/Main.module.css';
import { instructorData, graduatesData } from '../data/data';
import { imageMain } from '../data/imageBackground';

function GraduateCard({ graduate }) {
  return (
    <div className={classes.cardGraduates}>
      <img src={graduate.picture} alt={graduate.name} className={classes.pictureGraduatesPosition} />
      <img src={imageMain.quotemarksLeft} alt='quotemarksLeft' className={classes.quotemarkLeftPosition} />
      <img src={imageMain.quotemarksRight} alt='quotemarksRight' className={classes.quotemarkRightPosition} />
      <div className={classes.textCardGraduatesContainer}>
        <h3 style={{ color: 'var(--Primary, #2F5FAC)' }}>{graduate.name}</h3>
        <p className='cf-body-2' style={{ color: 'var(--gray-700, #646D89)' }}>{graduate.description}</p>
      </div>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();

  const graduatesCarouselSlides = graduatesData.map((grad, index) => {
    return (
      <Carousel.Slide key={index}>
        <GraduateCard graduate={grad} />
      </Carousel.Slide>);
  });



  return (
    <>
      <div className={classes.mainTop}>
        <div className={classes.box1}>
          <h1>Best Virtual Classroom Software</h1>
        </div>
        <div className={classes.box2}>
          <p className='cf-body-1'>Welcome to Schooler! The one-stop online class management system that caters to all your educational needs!</p>
        </div>
        <button className={classes.exploreButton} onClick={() => {
          navigate('/our-course');
        }}>
          <p className='cf-body-2' style={{ fontWeight: '700' }} >Explore Courses</p>
        </button>
        <img className={classes.backgroundBlue} src={imageMain.backgroundBlue} />
        <img className={classes.computer} src={imageMain.computer} />
        <img className={classes.ellipseLeft} src={imageMain.ellipseLeft} />
        <img className={classes.cross} src={imageMain.cross} />
        <img className={classes.circleBlue} src={imageMain.circleBlue} />
        <img className={classes.polygon} src={imageMain.polygon} />
        <img className={classes.circleGreen} src={imageMain.circleGreen} />
      </div>
      <div className={classes.mainMiddle}>
        <div className={classes.container}>
          <div className={classes.row1}>
            <img className={classes.picRow1} src={imageMain.picRow1}/>
            <div className={classes.textContainer}>
              <div className={classes.textHead}>
                <h2>Learning experience has been enhanced with new technologies</h2>
              </div>
              <div className={classes.textBox}>
                <div className={classes.iconBox}>
                  <img src={imageMain.secure} />
                </div>
                <div>
                  <div className={classes.textSubhead}>
                    <h3 style={{ lineHeight: '0' }}>Secure & Easy</h3>
                  </div>
                  <div className={classes.text}>
                    <p className='cf-body-2'>Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint.</p>
                  </div>
                </div>
              </div>
              <div className={classes.textBox}>
                <div className={classes.iconBox}>
                  <img src={imageMain.support} />
                </div>
                <div>
                  <div className={classes.textSubhead}>
                    <h3 style={{ lineHeight: '0' }}>Supports All Students</h3>           
                  </div>
                  <div className={classes.text}>
                    <p className='cf-body-2' >Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.row2}>
            <div className={classes.textContainer}>
              <div className={classes.textHead}>
                <h2>Interactions between the tutor and the learners</h2>
              </div>
              <div className={classes.textBox}>
                <div className={classes.iconBox}>
                  <img src={imageMain.collab} />
                </div>
                <div>
                  <div className={classes.textSubhead}>
                    <h3 style={{ lineHeight: '0' }}>Purely Collaborative</h3> 
                  </div>
                  <div className={classes.text}>
                    <p className='cf-body-2'>Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint.</p>
                  </div>
                </div>
              </div>
              <div className={classes.textBox}>
                <div className={classes.iconBox}>
                  <img src={imageMain.support} />
                </div>
                <div>
                  <div className={classes.textSubhead}>
                    <h3 style={{ lineHeight: '0' }}>Supports All Students</h3>                   
                  </div>
                  <div className={classes.text}>
                    <p className='cf-body-2'>Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint.</p>
                  </div>
                </div>
              </div>
            </div>
            <img className={classes.picRow2} src={imageMain.picRow2}/>
          </div>
        </div>
        <img className={classes.ellipseTop} src={imageMain.ellipseTop} />
        <img className={classes.circleGrey} src={imageMain.circleGrey} />
        <img className={classes.crossPurple} src={imageMain.crossPurple} />
        <img className={classes.ellipseBot} src={imageMain.ellipseBot} />
      </div>
      
      <div className={classes.containerProfessionalInstructors}>
        <img src={imageMain.polygonOrange} alt='polygonOrange' className={classes.polygonPosition} />
        <h2>Our Professional Instructors</h2>
        <div className={classes.containerCard}>
          {
            instructorData.map((items) => {
              return (
                <div className={classes.card} key={items.name}>
                  <img src={items.picture} alt={items.name} />
                  <div>
                    <h3 style={{ lineHeight: '1' }}>{items.name}</h3>
                    <p className='cf-body-2' style={{ lineHeight: '0' ,color: '#5483D0' }}>{items.position}</p>
                  </div>  
                </div>
              );
            })
          }
        </div>
      </div>

      <div className={classes.containerGraduates}>
        <h2>Our Graduates</h2>
        <div className={classes.graduatesCarousel}>
          <Carousel slideSize="15%" height={500} align="center" slideGap="xl"  withControls={false} >
            {graduatesCarouselSlides}
          </Carousel>
        </div>
        <img src={imageMain.bigEllipseRight} alt='bigEllipseRight' className={classes.bigEllipseRightPosition} />
        <img src={imageMain.smallEllipseRight} alt='smallEllipseRight' className={classes.smallEllipseRightPosition} />
        <img src={imageMain.plus} alt='plus' className={classes.plusPosition} />
      </div>
      <div className={classes.subFooter}>
        <div className={classes.leftSubFooter}>
          <h2>Want to start learning?</h2>
          <button className={classes.button} onClick={() => {
            navigate('/our-course');
            window.location.reload();
            window.scrollTo(0, 0);
          }}>
            <p>Check out our courses</p>
          </button>
        </div>
        <img src={imageMain.polygon} alt='polygon' width={42} height={42} className={classes.rightSubFooterPolygon} />
        <img src={imageMain.ellipse} alt='ellipse' width={26} height={26} className={classes.rightSubFooterEllipse} />
        <img src={imageMain.teachLogo} alt='teachLogo' width={592} height={448} className={classes.rightSubFooterTechLogo} />
      </div>
    </> 
  );
}

export default Landing;