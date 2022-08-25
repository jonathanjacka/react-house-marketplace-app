import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';

import Explore from './views/Explore';
import Category from './views/Category';
import Offers from './views/Offers';

import Listing from './views/Listing';

import PrivateRoute from './components/PrivateRoute';
import Profile from './views/Profile';
import CreateListing from './views/CreateListing';
import Contact from './views/Contact';

import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import ForgotPassword from './views/ForgotPassword';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route
            path='/category/:categoryName/:listingId'
            element={<Listing />}
          />

          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/create-listing' element={<CreateListing />} />
          </Route>

          <Route path='/contact' element={<PrivateRoute />}>
            <Route path='/contact/:landLordId' element={<Contact />} />
          </Route>

          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
        <NavBar />
      </Router>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default App;
