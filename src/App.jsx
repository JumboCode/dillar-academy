
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar/NavBar'
import PageRoutes from '@/components/PageRoutes'
import Welcome from '@/pages/Welcome';
import "./i18n.js";
import Footer from './components/Footer.jsx';

const App = () => {
  const [isNew, setNew] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("visited")) {
      setNew(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem("visited", "true");
    setNew(false);
  };

  return (
    <>
      <div className='min-h-screen grid grid-rows-[5rem_1fr] font-avenir box-border'>
        <div className={`${isNew ? 'hidden' : ''}`}>
          <NavBar />
        </div>
        <div className='hidden'></div>
        <div className='w-full'>
          {isNew ? (
            <Welcome onComplete={handleWelcomeComplete} />
          ) : (
            <PageRoutes />
          )}
        </div>
        <div className={`${isNew ? 'hidden' : ''}`}>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
