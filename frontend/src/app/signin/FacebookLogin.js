// src/components/FacebookLogin.jsx
import React, { useState, useEffect } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { initFacebookSdk, getLoginStatus } from '../utils/facebook';

const FacebookLoginComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initFacebookSdk();
        const status = await getLoginStatus();
        if (status.status === 'connected') {
          setIsLoggedIn(true);
          // Fetch user data if already logged in
          window.FB.api('/me', { fields: 'id,name,email,picture' }, (response) => {
            if (!response.error) {
              setUser(response);
            }
          });
        }
      } catch (error) {
        console.error('Facebook SDK init failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleLogin = (response) => {
    if (response.status === 'connected') {
      setIsLoggedIn(true);
      setUser(response.profileObj);  // Library provides parsed user obj
      console.log('Login success:', response);  // For debugging; handle token for backend
    } else {
      console.error('Login failed:', response);
    }
  };

  const handleLogout = () => {
    window.FB.logout((response) => {
      setIsLoggedIn(false);
      setUser(null);
      console.log('Logout success:', response);
    });
  };

  if (isLoading) {
    return <div>Loading Facebook...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {isLoggedIn ? (
        <div>
          <h2>Welcome, {user?.name}!</h2>
          <img src={user?.picture?.data?.url} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          <p>Email: {user?.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          callback={handleLogin}
          scope="public_profile,email"  // Add more scopes as needed, e.g., 'pages_show_list'
          fields="name,email,picture"
          render={(renderProps) => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
              Login with Facebook
            </button>
          )}
        />
      )}
    </div>
  );
};

export default FacebookLoginComponent;