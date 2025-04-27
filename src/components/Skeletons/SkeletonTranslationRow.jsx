import { IoChevronDownOutline } from "react-icons/io5";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonTranslationRow = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div key={i} className='w-full text-base sm:text-lg border-t border-dark-blue-800 flex items-center'>
        <div className='w-full grid grid-cols-[1fr_2fr]'>
          <div className="relative w-full border-r border-dark-blue-800 h-full px-3 py-4 flex items-center justify-center">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-2">
              <IoChevronDownOutline className={`text-xl text-dark-blue-800`} />
            </div>
            <p className="text-center px-10 w-full">
              <Skeleton />
            </p>
          </div>
          <div className='w-full text-left px-5 py-4'>
            <Skeleton count={2} />
          </div>
        </div>
      </div>
    ))
}

export default SkeletonTranslationRow;
