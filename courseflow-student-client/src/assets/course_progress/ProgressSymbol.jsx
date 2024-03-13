import circle_complete from './circle-complete.svg';
import circle_in_progress from './circle-in-progress.svg';
import circle_not_started from './circle-not-started.svg';

function ProgressSymbol({ status }) {
  let symbol;
  switch (status) {
  case 'IN_PROGRESS':
    symbol = <img src={circle_in_progress} alt="In Progress" />;
    break;
  case 'NOT_STARTED':
    symbol = <img src={circle_not_started} alt="Not Started" />;
    break;
  case 'COMPLETED':
    symbol = <img src={circle_complete} alt="Completed" />;
    break;
  default:
    symbol = null;
    break;
  }

  return (
    symbol
  );
}
export default ProgressSymbol;
  
  