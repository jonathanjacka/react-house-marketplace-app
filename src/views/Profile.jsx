import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

import { toast } from 'react-toastify';

function Profile() {

  const navigate = useNavigate();

  const auth = getAuth();

  const [ formData, setFormData ] = useState({
    name: auth.currentUser.displayName ? auth.currentUser.displayName : '',
    email: auth.currentUser.email ? auth.currentUser.email : '',
  });
  const [ changeDetails, setChangeDetails ] = useState(false);

  const { name, email } = formData;

  const handleLogOut = () => {
    auth.signOut();
    toast.success('You\'ve successfully logged out!');
    navigate('/');
  }

  const submitChangeDetails = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        //update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        });
        //update display name in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { name });
      }
    } catch (error) {
        console.log(error);
        toast.error(`There was an error with updaing your profile details: ${error.message}`);
    }
  }

  const onChange = (event) => {
    setFormData((prevState => ({
      ...prevState,
      [event.target.id]: event.target.value
    })));
  }

  return (
    <div className='profile'>

      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type='button' className='logOut' onClick={handleLogOut}>Log Out</button>
      </header>
      
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsHeaderText">User Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && submitChangeDetails();
            setChangeDetails(prev => !prev);
          }}>{
            changeDetails ? 'Done' : 'Edit'
          }</p>
        </div>

        <div className="profileCard">
          <form>
            <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange}/>
            <input type="email" id="email" className={'profileEmail'} value={email}/>
          </form>
        </div>
      </main>

    </div>
  )
}

export default Profile;
