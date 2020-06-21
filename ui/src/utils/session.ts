import { LOGGED_IN_KEY } from '../const';

const loggedIn = () => {
  return localStorage.getItem(LOGGED_IN_KEY) === 'true';
};
export { loggedIn };
