import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function Explore() {

  const [ email, setEmail ] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try { 

      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent!');

    } catch (error) {
      toast.error('Error with sending reset email: ' + error.message);
    }
  }

   
  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">
          Forgot Password
        </p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input type="email" className='emailInput' placeholder='Email' id='email' value={email} onChange={handleChange}/>
          <Link className='forgotPasswordLink' to='/sign-in'>Sign In</Link>

          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className='signInButton'><ArrowRightIcon fill='#fff' width='34px' height='34px'/></button>
          </div>
        </form>
      </main>

    </div>
  )
}

export default Explore;
