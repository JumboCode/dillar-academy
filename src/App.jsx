
import NavBar from '@/components/NavBar/NavBar'
import PageRoutes from '@/components/PageRoutes'
import "./i18n.js";

const App = () => {
  return (
    <>
      <div className='min-h-screen grid grid-rows-[5rem_1fr] font-avenir box-border'>
        <NavBar />
        <div className='hidden'></div>
        <div className='w-full'>
          <PageRoutes />
        </div>
      </div>
    </>
  );
}

export default App;
