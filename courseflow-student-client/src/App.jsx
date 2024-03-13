import './App.css';
import { Routes, Route } from 'react-router-dom';

import { MantineProvider } from '@mantine/core';
import courseflowTheme from './utils/courseflowDesignSystem';
import './App.css';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import './MantineComponents.css';
import PagesRouter from './pages/PagesRouter';
import { Callback } from './component';

export default function App() {

  return (
    <MantineProvider theme={courseflowTheme}>
      <Routes>
        <Route path='/callback' element={<Callback />} />
        <Route path='*' element={<PagesRouter />} />
      </Routes>
    </MantineProvider>
  );
  
}

