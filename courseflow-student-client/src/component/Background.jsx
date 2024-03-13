import classes from '../style/BackGround.module.css';
import { imageBackgrounds } from '../data/imageBackground';

function Background() {
  return (
    <div className={classes.backgroundPage}>
      <img src={imageBackgrounds.blueCircle} alt='blueCircle' className={classes.blueCirclePosition} />
      <img src={imageBackgrounds.leftBlueCircle} alt='leftBlueCircle' className={classes.leftBlueCirclePosition} />
      <img src={imageBackgrounds.triangle} alt='triangle' className={classes.trianglePosition} />
      <img src={imageBackgrounds.rightBlueCircle} alt='rightBlueCircle' className={classes.rightBlueCirclePosition} />
      <img src={imageBackgrounds.plus} alt='plus' className={classes.plusPosition} />
    </div>
  );
}

export default Background;