import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

import { getAuth, createUserWithEmailAndPassword, getProfile, updateProfile } from "firebase/auth";
import { db } from '../firebase.config';
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 

import { toast } from 'react-toastify';

import OAuth from '../components/OAuth';


function SignUp() {

  const [ showPassword, setShowPassword ] = useState(false);
  const [ formData, setFormData ] = useState({name: '', email: '', password: ''});

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (event) => {
    setFormData(previousState => ({
      ...previousState,
      [event.target.id]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      toast.success('User sign up was successful!');

      navigate('/');

    } catch (error) {
      console.log(error);
      toast.error(`Sign up was not successful - check to see all fields are completed correctly`);
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome - please sign up!
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <input type="text" className='nameInput' placeholder='Name' id='name' value={name} onChange={onChange}/>
            <input type="email" className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange}/>
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder='Password' id="password" value={password} onChange={onChange}/>
              <img src={visibilityIcon} alt="show-password" className='showPassword' onClick={() => setShowPassword(prev => !prev)}/>
            </div>

            <span className='forgotPasswordLink'>
              <Link to="/forgot-password">Forgot password?</Link>
            </span>
            

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton"><ArrowRightIcon fill='#fff' width='34px' height="34px" /></button>
            </div>
          </form>

          <OAuth /> 
          
          <span className='registerLink'>
            <Link to='/sign-in'>Already registered? Sign in instead</Link>
          </span>
        
        </main>
      </div>
    </>
  )
}

export default SignUp;