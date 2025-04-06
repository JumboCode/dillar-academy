
const Overlay = ({ children, width }) => {
  return (
    <div className='bg-black bg-opacity-50 fixed z-50 inset-0 grid place-items-center'>
      <div className={`${width} max-h-[80vh] bg-white rounded-lg p-6 space-y-5`}>
        {children}
      </div>
    </div>
  )
}

export default Overlay;