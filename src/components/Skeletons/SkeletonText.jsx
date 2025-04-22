import Skeleton from 'react-loading-skeleton'

const SkeletonText = ({ children, allowRender, count = 1 }) => {
  return allowRender
    ? children
    : <Skeleton count={count} />
}

export default SkeletonText;
