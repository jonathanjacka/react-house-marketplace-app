import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthStatus } from '../hooks/useAuthStatus';

import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

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
            <li>{listing.bathrooms === 1 ? `1 bathroom` : `${listing.bathrooms} bathrooms`}</li>
            <li>{listing.parking && `Parking included`}</li>
            <li>{listing.furnished && `Fully furnished`}</li>
            </ul>
            <p className="listingLocationTitle">Location</p>

            <div className="leafletContainer">
                <MapContainer style={{height: '100%', width: '100%'}} center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'/>
              <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                <Popup>{listing.location}</Popup>
              </Marker>
                </MapContainer>

                
            </div>

            {
                user.uid ? (user?.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact</Link>)) : (<Link to={`/sign-up`} className='primaryButton'>Contact</Link>)

            }

         </div>
    </main>
  )
}

export default Listing;