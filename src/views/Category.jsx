import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';

import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Category() {

    const [ listings, setLisitings ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ lastFetchedListing , setLastFetchedListing ] = useState(null);

    const {categoryName} = useParams();

    const handlePagination = async () => {
        try {
            //get collections ref from fb
            const listingsRef = collection(db, 'listings');
            //set query in fb
            const qry = query(
                listingsRef, 
                where('type', '==', categoryName), 
                orderBy('timestamp', 'desc'), 
                startAfter(lastFetchedListing),
                limit(10));
            //exe query in fb
            const qrySnapShot = await getDocs(qry);
            //set page
            const lastVisible = qrySnapShot.docs[qrySnapShot.docs.length - 1];
            setLastFetchedListing(lastVisible);
            !lastVisible && toast.info('There are no more listings');
            //get data from completed query
            const listings = [];
            qrySnapShot.forEach(doc => listings.push({ id: doc.id, data: doc.data()}));

            //set data to local state
            setLisitings(prevState => [...prevState, ...listings]);
            setLoading(false);

        } catch (error) {
            toast.error('Unable to fetch listings');
        }
    }

    useEffect( () => {
        const fetchLisitings = async () => {
            try {
                //get collections ref from fb
                const listingsRef = collection(db, 'listings');
                //set query in fb
                const qry = query(listingsRef, where('type', '==', categoryName), orderBy('timestamp', 'desc'), limit(10));
                //exe query in fb
                const qrySnapShot = await getDocs(qry);
                //set page
                const lastVisible = qrySnapShot.docs[qrySnapShot.docs.length - 1];
                setLastFetchedListing(lastVisible);
                //get data from completed query
                const listings = [];
                qrySnapShot.forEach(doc => listings.push({ id: doc.id, data: doc.data()}));

                //set data to local state
                setLisitings(listings);
                setLoading(false);

            } catch (error) {
                toast.error('Unable to fetch listings');
            }
        }
        fetchLisitings();
    }, [categoryName]);


  return (
    <div className='category'>
        <header>
            <p className="pageHeader">{ categoryName === 'rent' ? 'Listings for rent' : 'Listings for sale'}</p>  
        </header>

        {loading ? <Spinner /> : listings && listings.length > 0 ? 
            <>
                <main>
                    <ul className='categoryListings'>
                        {listings.map(listing => 
                            <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                        )}
                    </ul>

                    <br />
                    <br />

                    {lastFetchedListing && (
                        <p className='loadMore' onClick={handlePagination}>Load More</p>
                    )}
                </main>
            </>
         : <p>{`Currently, there are no listings for ${categoryName}.`}</p>}
    </div>
  )
}

export default Category;
