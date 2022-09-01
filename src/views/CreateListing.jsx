import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

//import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStatus } from '../hooks/useAuthStatus';

//image upload and storage
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function CreateListing() {

    const navigate = useNavigate();

    const { user } = useAuthStatus();

    const [ loading, setLoading ] = useState(false);

    const [ geolocationEnabled, setGeolocationEnabled ] = useState(true);
    const [ formData, setFormData ] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1, 
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: [],
        latitude: 0,
        longitude: 0,
    })

    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude } = formData;

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        setLoading(true);

        if(Number(discountedPrice) >= Number(regularPrice)){
            setLoading(false);
            toast.error(`Discounted price must be less than regular price`);
            return;
        }

        if(images.length > 6) {
            setLoading(false);
            toast.error('You can upload a maximum of 6 images only');
            return;
        }

        const geolocation = {};
        let location;
        
        if(geolocationEnabled) {

            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);

            const data = await response.json();
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address;

            if(location === undefined || location.includes('undefined')) {
                toast.error('Please enter a valid address');
                setLoading(false);
                return;
            }
            

        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        //image store
        const storeImage = async (img) => {
          return new Promise((resolve, reject) => {
            const storage = getStorage();
            const fileName = `${user.uid}-${img.name}-${uuidv4()}`;

            const storageRef = ref(storage, `images/` + fileName);
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused');
                    break;
                  case 'running':
                    console.log('Upload is running');
                    break;
                  default:
                    console.log('Upload is running');
                }
              }, 
              (error) => {
                reject(error);
              }, 
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL);
                });
              }
            );
          })
        }

        const imageUrls = await Promise.all(
          [...images].map(img => storeImage(img))
        )
        .catch(error => {
          setLoading(false);
          toast.error('Error: Images not uploaded successfully ');
          return;
        });

        const formDataCopy = {
          ...formData, 
          imageUrls,
          geolocation,
          userRef: user.uid,
          regularPrice: Number(regularPrice),
          discountedPrice: Number(discountedPrice),
          bathrooms: Number(bathrooms),
          bedrooms: Number(bedrooms),
          location: address,
          timestamp: serverTimestamp(),
        }

        delete formDataCopy.images;
        delete formDataCopy.address;
        
        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
        setLoading(false);
        toast.success('Listing was successfully created!');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    const handleChange = (event) => {
        let boolean = null;

        if(event.target.value === 'true') {
            boolean = true;
        }
        if(event.target.value === 'false') {
            boolean = false;
        }
        //files
        if (event.target.files) {
            setFormData(prev => ({...prev, images: event.target.files}));
        }

        //text/booleans/numbers
        if(!event.target.files) {
            setFormData(prev => ({ ...prev, [event.target.id]: boolean ?? event.target.value }));
        }

    } 

    if(loading) {
        return <Spinner />
    } else {
        return (
            <div className='profile'>
                <header>
                    <p className="pageHeader">Create a Listing</p>
                </header>

                <main>
                    <form onSubmit={handleSubmit}>
                        <label className='formLabel'>Sell / Rent</label>
                        <div className="formButtons">
                            <button type='button' className={type === 'sale' ? 'formButtonActive' : 'formButton'} id='type' value='sale' onClick={handleChange}>
                                Sell
                            </button>
                            <button type='button' className={type === 'rent' ? 'formButtonActive' : 'formButton'} id='type' value='rent' onClick={handleChange}>
                                Rent
                            </button>
                        </div>

                        <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={handleChange}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={handleChange}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={handleChange}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={handleChange}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={handleChange}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={handleChange}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={handleChange}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={handleChange}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={handleChange}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={handleChange}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={handleChange}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <div className='formPriceDiv'>
                <input
                  className='formInputSmall'
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={handleChange}
                  min='50'
                  max='750000000'
                  required={offer}
                />
                {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
              </div>
            </>

          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={handleChange}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>


                    </form>
                </main>
            </div>
        )
    }
}

export default CreateListing
