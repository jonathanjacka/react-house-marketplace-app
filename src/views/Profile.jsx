import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import { toast } from 'react-toastify';

function Profile() {

  const navigate = useNavigate();

  const auth = getAuth();

  const [ formData, setFormData ] = useState({
    name: auth.currentUser.displayName ? auth.currentUser.displayName : '',
    email: auth.currentUser.email ? auth.currentUser.email : '',
  });
  const { name, email } = formData;

  const [ changeDetails, setChangeDetails ] = useState(false);
  const [ listings, setListings ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  useEffect( () => {  
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');
      const qry = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(qry);

      const listings = [];
      querySnapshot.forEach(doc => listings.push({ id: doc.id, data: doc.data()}));

      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();

  }, [auth.currentUser.uid]);

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

  const handleDelete = async (listingId) => {

    if(window.confirm('Are you sure you want to delete this listing?')) {
      const docRef = doc(db, 'listings', listingId);
      await deleteDoc(docRef);
      const updatedListings = listings.filter((listing) => listing.id !== listingId);
      setListings(updatedListings);
      toast.success('Successfully deleted listing!');
    }

  }

  if(loading) {
    return <Spinner />
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
            <input type="email" id="email" className={'profileEmail'} value={email} readOnly/>
          </form>
        </div>

        <Link to='/profile/create-listing' className='createListing'>
          <img src={homeIcon} alt='home'/>
          <p>Sell or rent your property</p>
          <img src={arrowRight} alt='arrow-right'/>
        </Link>

        {
          listings.length > 0 &&  (
            <>
              <p className='listingText'>Your current listings:</p>
              <ul className="listingsList">
                {listings.map(listing => <ListingItem key={listing.id} listing={listing.data} id={listing.id} handleDelete={() => handleDelete(listing.id)}/>)}
              </ul>
            </>
          )
        }
      </main>
    </div>
  )
}

export default Profile;
