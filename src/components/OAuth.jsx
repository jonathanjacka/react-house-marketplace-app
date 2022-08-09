import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {

    const location = useLocation();
    const navigate = useNavigate();

    const onGoogleClick = async () => {
        try {

            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            //check for user 
            const docRef = doc(db, 'users', user.uid);
            const docSnapShot = await getDoc(docRef);

            if(!docSnapShot.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }
            toast.success('Authorization with Google successful!');
            navigate('/');

        } catch (error){
            toast.error('Could not authorize with Google')
        }
    }

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt="google-sign-in" />
      </button>
    </div>
  )
}

export default OAuth
