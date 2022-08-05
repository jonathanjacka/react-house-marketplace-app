import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';


function SignIn() {

  const [ showPassword, setShowPassword ] = useState(false);
  const [ formData, setFormData ] = useState({email: '', password: ''});

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (event) => {
    setFormData(previousState => ({
      ...previousState,
      [event.target.id]: event.target.value,
    }))
  }

  const onSumbit = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if(userCredential.user) {
        toast.success('Sign in successful!');
        navigate('/');
      }

    } catch (error) {
      console.log(error.message);
      toast.error(`Error with sign in: email/password does not match`);
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome back!
          </p>
        </header>

        <main>
          <form onSubmit={onSumbit}>
            <input type="email" className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange}/>
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder='Password' id="password" value={password} onChange={onChange}/>
              <img src={visibilityIcon} alt="show-password" className='showPassword' onClick={() => setShowPassword(prev => !prev)}/>
            </div>
            <Link to="/forgot-password" className='forgotPasswordLink'>Forgot password?</Link>

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton"><ArrowRightIcon fill='#fff' width='34px' height="34px" /></button>
            </div>
          </form>

          {/* Google Sign in */}

          <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>

        </main>
      </div>
    </>
  )
}

export default SignIn;
