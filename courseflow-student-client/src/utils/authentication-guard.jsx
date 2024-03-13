import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component);
  return <Component />;
};