import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';

import firebase from './utils/firebase';
import { LOGGED_IN_KEY } from './const';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null);

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((u) => {
      const loggedIn = Boolean(u);
      localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(loggedIn));

      setCurrentUser(u); // Must be the last statement
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes currentUser={currentUser} />
    </Router>
  );
};

export default App;
