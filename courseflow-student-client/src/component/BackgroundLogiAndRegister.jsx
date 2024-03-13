import classes from '../style/BackgroundLoginAndRegister.module.css';
import { imageRegisterAndLogin } from '../data/imageBackground';

function BackgroundLoginAndRegister() {
  return (
    <div className={classes.backgroundPage}>
      <img src={imageRegisterAndLogin.blueRight} alt='bigVector' className={classes.bigVectorPosition} />
      <img src={imageRegisterAndLogin.circleGreyRL} alt='mediumEllipse' className={classes.mediumEllipsePosition} />
      <img src={imageRegisterAndLogin.circleOrange} alt='smallEllipse' className={classes.smallEllipsePosition} />
      <img src={imageRegisterAndLogin.crossGreen} alt='plus' className={classes.plusPosition} />
      <img src={imageRegisterAndLogin.orangeLeft} alt='circle' className={classes.circlePosition} />
    </div>
  );
}

export default BackgroundLoginAndRegister;