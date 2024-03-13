import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { imagesSideBar } from '../data/images.js';
import classes from '../style/SideBar.module.css';

export function SideBar({ isActive }) {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    console.log(isActive);
  }, [isActive]); // Include isActive as a dependency for useEffect

  return (
    <div>
      <div className={classes.sideBar}>
        <img
          onClick={() => navigate('/course')}
          className={classes.logo}
          src={imagesSideBar.courseFlow}
          alt='courseFlowLogo'
        />
        <div className={classes.controlPanel}>
          <span className="cf-body-2" style={{ color: 'var(--gray-700, #646D89)' }}>
            Admin Panel Control
          </span>
        </div>

        <div
          onClick={() => navigate('/course')}
          className={classes.menu}
          style={isActive === 'course' ? { background: '#F1F2F6' } : { background: 'white' }}
        >
          <img src={imagesSideBar.course} alt='courseIcon' />
          <span className='cf-body-2' style={{ fontWeight: '500', color: 'var(--gray-800, #424C6B)' }}>
            Course
          </span>
        </div>

        <div
          onClick={() => navigate('/assignment')}
          className={classes.menu}
          style={isActive === 'assignment' ? { background: '#F1F2F6' } : { background: 'white' }}
        >
          <img src={imagesSideBar.assignment} alt="assignmentIcon" />
          <span className="cf-body-2" style={{ fontWeight: '500', color: 'var(--gray-800, #424C6B)' }}>
            Assignment
          </span>
        </div>
        <div onClick={handleLogout} className={classes.menu}>
          <img src={imagesSideBar.logout} alt="logoutIcon" />
          <span className="cf-body-2" style={{ fontWeight: '700', color: 'var(--gray-800, #424C6B)' }}>
            Log out
          </span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
