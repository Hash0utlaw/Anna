// pages/login.tsx
import React from 'react';
import FacebookLoginButton from '../components/FacebookLogin';
import { signIn, signOut, useSession } from 'next-auth/react';

const Login = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login with Facebook</h1>
      <FacebookLoginButton />
    </div>
  );
};

export default Login;
