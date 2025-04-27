import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonSchedule = () => {
  return (
    <div className='grid grid-cols-7 gap-x-4'>
      {Array(7).fill(0).map((_, i) => (
        <Skeleton key={i} height={"12rem"} />
      ))}
    </div>
  )
}

export default SkeletonSchedule;
