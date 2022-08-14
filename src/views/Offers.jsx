import { useEffect, useState } from 'react';

import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';

import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {

    const [ listings, setLisitings ] = useState(null);
    const [ loading, setLoading ] = useState(true);


    useEffect( () => {
        const fetchLisitings = async () => {
            try {
                //get collections ref from fb
                const listingsRef = collection(db, 'listings');
                //set query in fb
                const qry = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc', limit(10)));
                //exe query in fb
                const qrySnapShot = await getDocs(qry);
                //get data from completed query
                const listings = [];
                qrySnapShot.forEach(doc => listings.push({ id: doc.id, data: doc.data()}));

                //set data to local state
                setLisitings(listings);
                setLoading(false);

            } catch (error) {
              console.log(error.message);
                toast.error('Unable to fetch listings: ' + error.message);
            }
        }
        fetchLisitings();
    }, []);


  return (
    <div className='category'>
        <header>
            <p className="pageHeader">Special offers:</p>  
        </header>

        {loading ? <Spinner /> : listings && listings.length > 0 ? 
            <>
                <main>
                    <ul className='categoryListings'>
                        {listings.map(listing => 
                            <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                        )}
                    </ul>
                </main>
            </>
         : <p>{`Currently, there are no listings with special offers.`}</p>}
    </div>
  )
}

export default Offers;
