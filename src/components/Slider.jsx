import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

import Spinner from './Spinner';

function Slider() {

    const [ loading, setLoading ] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();

    useEffect( () => {

        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings');
            const qry = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnapshot = await getDocs(qry);

            console.log(querySnapshot);

            const listings = [];
            querySnapshot.forEach(doc =>  listings.push({id: doc.id, data: doc.data()}));

            setListings(listings);
            setLoading(false);
        }

        fetchListings();
        
    }, []);
        

    if(loading) {
        return <Spinner />
    }

    if (listings.length === 0) {
        return <></>
      }

    

  return (
    <>
      <p className='exploreHeading'>Recommended</p>
      <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            style={{ height: '300px' }}
            navigation
        >
            {listings.map(({ data, id }) => {
                return (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                <div
                    style={{
                    background: `url(${data.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                    }}
                    className='swiperSlideDiv'
                >
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  ${data.discountedPrice ? data.discountedPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data.regularPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  {data.type === 'rent' && '/ month'}
                </p>
              </div>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    </>
  )
}

export default Slider
