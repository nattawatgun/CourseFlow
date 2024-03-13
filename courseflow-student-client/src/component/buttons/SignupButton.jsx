import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
export default function SignupButton() {
  return (
    <Link to="/register"><Button>Register</Button></Link>
  );
}