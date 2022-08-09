import { Link } from 'react-router-dom';

import  { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem( { listing: {type, imageUrls, name, location, offer, discountedPrice, regularPrice, bedrooms, bathrooms}, id, handleDelete }) {

    const priceDisplay = (price) => {
        return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (type === 'rent' && ` / month`);
    };

  return (
    <li className='categoryListing'>
        <Link to={`/category/${type}/${id}`} className='categoryListingLink'>
            <img src={imageUrls[0]} alt={name} className='categoryListingImg'/>
            <div className="categoryListingDetails">

                <p className="categoryListingLocation">{location}</p>
                <p className="categoryListingName">{name}</p>
                <p className="categoryListingPrice">{offer ? priceDisplay(discountedPrice) : priceDisplay(regularPrice)}</p>
                
                <div className="categoryListingInfoDiv">
                    <img src={bedIcon} alt='bed' />
                    <p className="categoryListingInfoText">{bedrooms === 1 ? `1 Bedroom` : `${bedrooms} Bedrooms`}</p>
                    <img src={bathIcon} alt="bath"/>
                    <p className="categoryListingInfoText">{bathrooms === 1 ? `1 Bathroom` : `${bathrooms} Bathrooms`}</p>
                </div>
            </div>
        </Link>
        {handleDelete && (
            <DeleteIcon className='removeIcon' fill='red' onClick={() => handleDelete(id, name)}/>
        )}
    </li>
  )
}

export default ListingItem
