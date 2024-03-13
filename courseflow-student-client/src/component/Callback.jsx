import classes from '../style/Header.module.css';
import { imageHeader } from '../data/imageBackground';
import Background from './Background';

import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();
  return (
    <>
      <div className={classes.header}>
        <div className={classes.courseFlowLogo}>
          <img
            src={imageHeader.courseFlow}
            alt="courseFlowLogo"
            onClick={() => {
              navigate('/');
            }}
          />
        </div>
      </div>
      <Background />
    </>
  );
}
export default Callback;