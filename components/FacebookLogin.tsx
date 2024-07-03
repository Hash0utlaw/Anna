// components/FacebookLogin.tsx
import React from 'react';
import FacebookLogin from 'react-facebook-login-lite';

type FacebookResponse = {
  authResponse: {
    accessToken: string;
    userID: string;
  };
  status: string;
};

const FacebookLoginButton = () => {
  const responseFacebook = (response: FacebookResponse) => {
    if (response.status === 'connected') {
      console.log(response);
      // Handle login success (e.g., save user info)
    } else {
      console.error('Login failed:', response);
    }
  };

  return (
    <FacebookLogin
      appId={process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string}
      fields="name,email,picture"
      scope="public_profile,email"
      onSuccess={responseFacebook}
      onFailure={(error) => console.error('Login failed:', error)}
      btnText="Login with Facebook"
    />
  );
};

export default FacebookLoginButton;


