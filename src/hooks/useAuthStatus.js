import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  //Why use this here and in useEffect?  https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
  const _isMounted = useRef(true);

  useEffect(() => {
    let unsubscribe;

    if (_isMounted.current) {
      const auth = getAuth();
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
          setUser(user);
        }
        setLoading(false);
      });
    }

    return () => {
      _isMounted.current = false;
      unsubscribe && unsubscribe();
    };
  }, [_isMounted]);

  return { user, loggedIn, loading };
};
