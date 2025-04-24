
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar/NavBar'
import Welcome from '@/pages/Welcome';
import Footer from './components/Footer.jsx';
import PageRoutes from '@/components/PageRoutes'
import "./i18n.js";
import { useUser } from '@clerk/clerk-react'
import { getUser } from './api/user-wrapper.js';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { SkeletonTheme } from 'react-loading-skeleton';

export function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => {
  const [userData, setUser] = useState(null);
  const [isNew, setNew] = useState(false);

  const { isLoaded, user, isSignedIn } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const userFilter = new URLSearchParams(`email=${user.primaryEmailAddress.emailAddress}`);
      const response = await getUser(userFilter);
      setUser(response.data);
    }

    if (!isLoaded) {
      return;
    }

    // check if Welcome page should be shown or not
    if (!localStorage.getItem("visited")) {
      setNew(true);
    }

    if (userData == null && isSignedIn) {
      fetchUser();
    } else if (!isSignedIn) {
      setUser(null);
    }
  }, [isLoaded, isSignedIn, user, userData])

  const handleWelcomeComplete = () => {
    localStorage.setItem("visited", "true");
    setNew(false);
  };

  return (
    <>
      <ScrollToTop />
      <div className='max-h-screen grid grid-rows-[5rem_minmax(auto,_1fr)] font-avenir font-normal box-border'>
        <SkeletonTheme baseColor="#C2CFD6" highlightColor="#F0F3F5">
          <UserContext.Provider value={{ user: userData, setUser: setUser }}>
            <div className={`${isNew ? 'hidden' : ''} row-start-1`}>
              <NavBar />
            </div>
            {isNew ? (
              <div className="row-start-1 h-screen row-span-2">
                <Welcome onComplete={handleWelcomeComplete} />
              </div>
            ) : (
              <div className="row-start-2 min-h-[calc(100svh-5rem)]">
                <div className='w-full min-h-full flex flex-col items-center'>
                  <PageRoutes />
                </div>
                <div className={`w-full ${isNew ? 'hidden' : ''}`}>
                  <Footer />
                </div>
              </div>
            )}
          </UserContext.Provider>
        </SkeletonTheme>
      </div >
    </>
  );
}

export default App;
