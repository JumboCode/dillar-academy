import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonClass = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div key={i} className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden">
        {/* Header */}
        <div className='mb-4'>
          <h3 className="font-extrabold text-dark-blue-800 mb-1">
            <Skeleton />
          </h3>
          <p className="text-sm text-neutral-400">
            <Skeleton />
          </p>
        </div>
        {/* Schedule */}
        <div className="grid grid-rows-2 grid-cols-[min-content_auto] w-1/2 items-center gap-x-2 gap-y-1 mb-5">
          <Skeleton className='row-start-1 col-start-1' circle width={"1.25rem"} height={"1.25rem"} />
          <Skeleton className='row-start-2 col-start-1' circle width={"1.25rem"} height={"1.25rem"} />
          <p className="row-start-1 col-start-2 w-full">
            <Skeleton />
          </p>
          <p className="row-start-2 col-start-2 w-full">
            <Skeleton />
          </p>
        </div>
        <div className='h-10 w-1/3'>
          <Skeleton height={"100%"} />
        </div>
      </div>
    ))
}

export default SkeletonClass
