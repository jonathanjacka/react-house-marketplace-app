import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';


function Contact() {

    const [ message, setMessage ] = useState();
    const [ landlord, setLandlord ] = useState(null);
    // eslint-disable-next-line
    const [ searchParams, setSearchParams ] = useSearchParams();

    console.log(searchParams);

    const { landLordId } = useParams();

    useEffect( () => {
        const getLandLord = async () => {
            const docRef = doc(db, 'users', landLordId);
            const docSnapshot = await getDoc(docRef);

            if(docSnapshot) {
                setLandlord(docSnapshot.data());
            } else {
                toast.error('Unable to retrieve landlord information');
            }
        }

        getLandLord();

    }, [landLordId]);

    const handleChange = (event) => setMessage(event.target.value);
    



  return (
    <div className='pageContainer'>
        <header className='pageHeader'>
            Contact Landlord
        </header>
      {landlord && (
        <main>

            <div className="contactLandlord">
                <p className="landlordName">
                    Contact {landlord?.name}
                </p>
            </div>

            <form className='messageForm'>
                <div className="messageDiv">
                    <label htmlFor="message" className="messageLabel">Message</label>
                    <textarea name="message" id="message" className='textarea' value={message} onChange={handleChange} style={{resize: 'none'}}></textarea>
                </div>

                <a
                    href={`mailto:${landlord.email}?Subject=${searchParams.get(
                        'listingName'
                    )}&body=${message}`}
                    target="_blank" 
                    rel="noreferrer"
                >
                    <button type='button' className='primaryButton'>
                        Send Message
                    </button>
                </a>
            </form>
        </main>
      )}
    </div>
  )
}

export default Contact
