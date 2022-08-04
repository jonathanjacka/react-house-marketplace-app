import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';


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

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome - please sign up!
          </p>
        </header>

        <main>
          <form>
            <input type="text" className='nameInput' placeholder='Name' id='name' value={name} onChange={onChange}/>
            <input type="email" className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange}/>
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder='Password' id="password" value={password} onChange={onChange}/>
              <img src={visibilityIcon} alt="show-password" className='showPassword' onClick={() => setShowPassword(prev => !prev)}/>
            </div>
            <Link to="/forgot-password" className='forgotPasswordLink'>Forgot password?</Link>

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton"><ArrowRightIcon fill='#fff' width='34px' height="34px" /></button>
            </div>
          </form>

          {/* Google Sign in */}
          <div>
          <Link to='/sign-in' className='registerLink'>Already registered? Sign in instead</Link>
          </div>
        
        </main>
      </div>
    </>
  )
}

export default SignUp;