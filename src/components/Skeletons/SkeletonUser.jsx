import { LuPencil } from "react-icons/lu";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonUser = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div key={i} className="flex py-3 px-4 justify-between items-center space-x-3 w-full rounded-sm flex-space-between">
        <div className="flex flex-col w-full *:w-full">
          <p className="font-semibold">
            <Skeleton />
          </p>
          <p className="text-sm">
            <Skeleton count={2} width={"50%"} />
          </p>
        </div>
        <div className="flex-shrink-0">
          <LuPencil className="text-lg" />
        </div>
      </div>
    ))
}

export default SkeletonUser
