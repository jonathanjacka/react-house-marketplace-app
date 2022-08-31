import { Link } from 'react-router-dom';

import  { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import  { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem( { listing: {type, imageUrls, name, location, offer, discountedPrice, regularPrice, bedrooms, bathrooms}, id, handleDelete, handleEdit }) {

  return (
    <li className='categoryListing'>
        <div className="categoryListingContainer">
        <Link to={`/category/${type}/${id}`} className='categoryListingLink'>
            <img src={imageUrls[0]} alt={name} className='categoryListingImg'/>
            <div className="categoryListingDetails">

                <p className="categoryListingLocation">{location}</p>
                <p className="categoryListingName">{name}</p>
                <p className="categoryListingPrice">$ {offer
              ? discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {type === 'rent' && ' / month'}</p>
                
                <div className="categoryListingInfoDiv">
                    <img src={bedIcon} alt='bed' />
                    <p className="categoryListingInfoText">{bedrooms === 1 ? `1 Bedroom` : `${bedrooms} Bedrooms`}</p>
                    <img src={bathIcon} alt="bath"/>
                    <p className="categoryListingInfoText">{bathrooms === 1 ? `1 Bathroom` : `${bathrooms} Bathrooms`}</p>
                </div>
            </div>
        </Link>
        </div>

        {
            (handleDelete || handleEdit) && (
                <div className="categoryListingButtonDiv">
                    {handleDelete && (
                        <DeleteIcon className='removeIcon' fill='red' onClick={() => handleDelete(id, name)}/>
                    )}
                    {handleEdit && (
                        <EditIcon className='editIcon' fill='green' onClick={() => handleEdit(id)}/>
                    )}
                </div>
            )
        }


    </li>
  )
}

export default ListingItem
