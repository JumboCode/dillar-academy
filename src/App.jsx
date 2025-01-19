
import NavBar from '@/components/NavBar/NavBar'
import PageRoutes from '@/components/PageRoutes'
import "./i18n.js";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react'
import { getUser } from './api/user-wrapper.js';
import { UserContext } from '@/contexts/UserContext.jsx';

const App = () => {
  const [userData, setUser] = useState(null)
  const [allowRender, setAllowRender] = useState(false)
  const { user, isSignedIn } = useUser();

  // ensure user context is set before page loads
  useEffect(() => {
    const fetchUser = async () => {
      const userFilter = new URLSearchParams(`email=${user.primaryEmailAddress.emailAddress}`);
      const response = await getUser(userFilter);
      setUser(response.data);
      setAllowRender(true);
    }

    if (userData == null && isSignedIn) {
      fetchUser();
    } else if (!isSignedIn) {
      setUser(null);
      setAllowRender(true);
    } else {
      setAllowRender(true);
    }
  }, [isSignedIn, user, userData])

  if (!allowRender) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='min-h-screen grid grid-rows-[5rem_1fr] font-avenir box-border'>
        <UserContext.Provider value={{ user: userData, setUser: setUser }}>
          <NavBar />
          <div className='hidden'></div>
          <div className='w-full'>
            <PageRoutes />
          </div>
        </UserContext.Provider>
      </div>
    </>
  );
}

export default App;
