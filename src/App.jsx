
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar/NavBar'
import Welcome from '@/pages/Welcome';
import Footer from './components/Footer.jsx';
import PageRoutes from '@/components/PageRoutes'
import "./i18n.js";
import { useUser } from '@clerk/clerk-react'
import { getUser } from './api/user-wrapper.js';
import { UserContext } from '@/contexts/UserContext.jsx';

const App = () => {
  const [userData, setUser] = useState(null);
  const [allowRender, setAllowRender] = useState(false);
  const [isNew, setNew] = useState(false);

  const { user, isSignedIn } = useUser();

  // ensure user context is set before page loads
  useEffect(() => {
    const fetchUser = async () => {
      const userFilter = new URLSearchParams(`email=${user.primaryEmailAddress.emailAddress}`);
      const response = await getUser(userFilter);
      setUser(response.data);
      setAllowRender(true);
    }

    // check if Welcome page should be shown or not
    if (!localStorage.getItem("visited")) {
      setNew(true);
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

  const handleWelcomeComplete = () => {
    localStorage.setItem("visited", "true");
    setNew(false);
  };

  if (!allowRender) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='max-h-screen grid grid-rows-[5rem_minmax(auto,_1fr)] font-avenir font-normal box-border'>
        <UserContext.Provider value={{ user: userData, setUser: setUser }}>
          <div className={`${isNew ? 'hidden' : ''} row-start-1`}>
            <NavBar />
          </div>
          <div className="row-start-2 min-h-[calc(100vh-5rem)] overflow-y-scroll flex flex-col">
            <div className='w-full flex-1'>
              {isNew ? (
                <Welcome onComplete={handleWelcomeComplete} />
              ) : (
                <PageRoutes />
              )}
            </div>
            <div className={`w-full ${isNew ? 'hidden' : ''}`}>
              <Footer />
            </div>
          </div>
        </UserContext.Provider>
      </div >
    </>
  );
}

export default App;
