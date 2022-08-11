import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStatus } from '../hooks/useAuthStatus';

import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function CreateListing() {

    const { user } = useAuthStatus();

    const { loading, setLoading } = useState(false);
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

    if(loading) {
        return <Spinner />
    } else {
        return (
            <div>
                <h2>New Cool Listing</h2>
            </div>
        )
    }
}

export default CreateListing
