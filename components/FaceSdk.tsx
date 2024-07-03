// components/FaceSdk.tsx
import { useEffect } from 'react';

const FacebookSDK = () => {
  useEffect(() => {
    if (!window.FB) {
      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        const js = d.createElement(s) as HTMLScriptElement; 
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        if (fjs.parentNode) {
          fjs.parentNode.insertBefore(js, fjs);
        }
        js.onload = () => {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
            cookie: true,
            xfbml: true,
            version: 'v10.0'
          });
        };
      }(document, 'script', 'facebook-jssdk'));
    }
  }, []);

  return null;
};

export default FacebookSDK;



