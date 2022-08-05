import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth';

function Profile() {

  const [ user, setUser ] = useState();

  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
  }, [auth.currentUser]);

  return (
    <div>
      {user ? <h1>{user.displayName}</h1> : 'Not logged in'}
    </div>
  )
}

export default Profile;
