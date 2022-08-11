import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function CreateListing() {

    const navigate = useNavigate();
    const isMounted = useRef(true);

    const auth = getAuth();

    const { loading, setLoaing } = useState(true);
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

    useEffect(() => {

        let unsubscribe;

        if(isMounted) {
            unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData(formData => ({ ...formData, userRef: user.uid }));
                } else {
                    navigate('/sign-in');
                }
            });
        }
        //prevent memory leak - prevents component from re-rendering before previous has unmounted
        return () => {
            isMounted.current = false;
            unsubscribe && unsubscribe(); //closes
        };
    }, [isMounted, auth, navigate]);

    if(loading) {
        return <Spinner />
    } else {
        return (
            <div>
                <h2>New Listing</h2>
            </div>
        )
    }
}

export default CreateListing
