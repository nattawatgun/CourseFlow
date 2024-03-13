import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Image
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import courseFlow from '../images/imagesLogin/CourseFlow.svg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const { supabase, session } = useAuth();
  const [errorLogin, setLoginError ] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !password) {
      setErrorEmail('Please Enter your email');
      setErrorPassword('Please Enter your password');
      return;
    } else if (!email) {
      setErrorEmail('Please Enter your email');
      return;
    } else if (!password) {
      setErrorPassword('Please Enter your password');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (session) {
      console.log(session);
      navigate('/course-list');
    }
    else {
      console.error(error); 
      setLoginError('Email or Password is invalid');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--utility-linear2, linear-gradient(271deg, #5697FF 7.78%, #2558DD 73.86%))' }}>
      <Container size={600} pt={60}>
        <Paper pr={60} pl={60} pb={80}>
          <Title pt={60}>
            <Image src={courseFlow} />
          </Title>
          <Text component='h3' style={{ fontWeight: '700', color: 'var(--gray-700, #646D89)' }} ta="center" mt={24} mb={46}>
            Admin Panel Control
          </Text>
          <form onSubmit={handleSubmit}>
            <TextInput label='Email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            {errorEmail && !email && <div style={{ color: 'red' }}>{errorEmail}</div>}
            <PasswordInput label='Password' placeholder='Enter Password' mt={40} mb={40} value={password} onChange={(e) => setPassword(e.target.value)} />
            {errorPassword && !password && <div style={{ color: 'red', marginTop: '-40px', marginBottom: '40px' }}>{errorPassword}</div>}
            <Button type='submit' fullWidth>
              Log in
            </Button>
            {errorLogin && <div style={{ color: 'red' }}>{errorLogin}</div>}
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;