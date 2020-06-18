import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';

import firebase from './utils/firebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null);

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((u) => setCurrentUser(u));
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes currentUser={currentUser} />
    </Router>
  );
};

export default App;
