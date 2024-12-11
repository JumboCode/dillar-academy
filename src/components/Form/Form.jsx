
const Form = ({ children, width }) => {
  return (
    <div className={`bg-white rounded-xl h-fit py-12 px-10 shadow-2xl ${width}`}>
      {children}
    </div>
  )
}

export default Form