import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './Header';
import Routes from './Routes';

import firebase from './utils/firebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((u) => setCurrentUser(u));
  }, []);

  return (
    <Router>
      <Header currentUser={currentUser} />
      <Routes currentUser={currentUser} />
    </Router>
  );
};

export default App;
