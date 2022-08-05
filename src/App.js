import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';

import Explore from './views/Explore';
import Profile from './views/Profile';
import Offers from './views/Offers';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import ForgotPassword from './views/ForgotPassword';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
        <NavBar />
      </Router>
    </>
  );
}

export default App;
