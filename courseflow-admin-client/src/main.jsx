import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithNavigate from './contexts/auth0-provider-with-navigate.jsx';
import { AuthenticationGuard } from './component/AuthenticationGuard.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <Routes>
          <Route path='*' element={<AuthenticationGuard component={App} />}/>
        </Routes>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
);
