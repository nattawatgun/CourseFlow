import React, { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useAxiosWithAuth0 from '../utils/interceptor';


export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { isAuthenticated } = useAuth0();
  const { axiosInstance } = useAxiosWithAuth0();

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance.get('/user/profile')
        .then(response => {
          if (!response.data.avatarUrl) {
            const nameForPlaceholder = response.data.name.split(' ').join('+');
            const placeHolderUrl = `https://ui-avatars.com/api/?name=${nameForPlaceholder}`;
            response.data.tempAvatarUrl = placeHolderUrl;
          }
          setProfile(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [isAuthenticated]);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
