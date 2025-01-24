
import { useLocation } from 'wouter';
import Button from '../components/Button/Button';

const PageNotFound = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="w-full flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl md:text-6xl mb-2 mx-2 font-bold pt-5 py-5" >Page Not Found</h1>
      <h2 className="text-2xl md:text-3xl mx-2 font-normal"> The page you're looking for doesn't exist.</h2>
      <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5 items-center justify-center text-center whitespace-nowrap pt-8'>
        <Button
          label={"Return Home"}
          onClick={() => setLocation("/")}
          isOutline={false}
        />
        <Button
          label={"Get Help"}
          onClick={() => setLocation("/")}
          isOutline={true}
        />
      </div>
    </div>
  )
}

export default PageNotFound;