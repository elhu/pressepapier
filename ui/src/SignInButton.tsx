import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { GoogleLoginButton } from 'react-social-login-buttons';

import firebase from './utils/firebase';
import { ROUTE_HOME } from './const';

interface IProps extends RouteComponentProps {
  className: string;
  text: string;
}

const SignInButton: React.FC<IProps> = (props: IProps) => {
  const handleGoogleSignup = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const user = await firebase.auth().currentUser;
      if (user) {
        await user.linkWithPopup(provider);
      } else {
        await firebase.auth().signInWithPopup(provider);
      }
      props.history.push(ROUTE_HOME);
    } catch (err) {
      console.log('err: ', err);
    }
  };

  return <GoogleLoginButton className={props.className} onClick={handleGoogleSignup} text={props.text} />;
};

export default withRouter(SignInButton);
