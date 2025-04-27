import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

const SkeletonLevel = ({ count, isSimplified, isArrowRight }) => {
  return Array(count)
    .fill(0)
    .map((_, i) => {
      return isSimplified ? (
        <div key={i} className="w-full h-full shadow-shadow rounded-2xl py-8 px-7">
          <div className={`w-full h-full rounded-2xl flex ${isArrowRight ? "" : "flex-row-reverse"} gap-x-3 sm:justify-between sm:items-center`}>
            <h3 className='w-full'>
              <Skeleton />
            </h3>
            {isArrowRight ? <IoChevronForward className="text-2xl text-[#2F2F32]" /> : <IoChevronBack className="text-2xl text-[#2F2F32]" />}
          </div>
        </div>
      ) : (
        <div key={i} className="w-full h-full shadow-shadow rounded-2xl grid grid-rows-2">
          <div className="bg-no-repeat bg-cover bg-center rounded-t-2xl overflow-hidden h-full">
            <Skeleton
              height={"100%"}
              inline
              style={{ display: 'block', margin: 0, borderRadius: 0 }}
            />
          </div>
          <div className="bg-white px-6 py-8 row-start-2 rounded-b-2xl space-y-1">
            <h3>
              <Skeleton />
            </h3>
            <p className="text-base sm:text-lg"><Skeleton /></p>
          </div>
        </div>
      )
    })
}

export default SkeletonLevel;
