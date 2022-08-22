import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthStatus } from '../hooks/useAuthStatus';

import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';

import { toast } from 'react-toastify';

function Listing() {

    const [ listing, setListing ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ shareLinkCopied, setShareLinkCopied ] = useState(false);

    const navigate = useNavigate();
    const { listingId } = useParams();
    const { user } = useAuthStatus();

    useEffect( () => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', listingId);
            const docSnapShot = await getDoc(docRef);

            if(docSnapShot.exists()) {
                const data = docSnapShot.data()
                console.log(data);
                setListing(data);
                setLoading(false);
            } else {
                toast.error('Error: Unable to get listing');
            }
        }
        fetchListing();
    }, [listingId]);

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareLinkCopied(true);
        setTimeout( () => setShareLinkCopied(false), 2000);
    }

    if(loading) {
        return <Spinner />
    }

  return (
    <main>
         {/* TODO: Slider */}
         <div className="shareIconDiv" onClick={handleShareClick}>
            <img src={shareIcon} alt="share" />
         </div>
         {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
         <div className='listingDetails'>
            <p className='listingName'>
                {listing.name} - {' '}
                <br/>
                {`${listing.offer ? "$" + listing.discountedPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "$" + listing.regularPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${listing.type === 'rent' ? '/ month' : ''}`}
            </p>
            <p className="listingLocation">{listing.location}</p>
            <p className='listingType'>{listing.type === 'rent' ? 'Rental' : 'Sale'}</p>
            {listing.offer && <p className='discountPrice'>{'$' + (listing.regularPrice - listing.discountedPrice).toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} discount</p>}

            <ul className='listingDetailsList'>
            <li>{listing.bedrooms === 1 ? `1 bedroom` : `${listing.bedrooms} bedrooms`}</li>
            </ul>
         </div>
    </main>
  )
}

export default Listing;