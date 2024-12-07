
const Form = ({ children, width }) => {
  return (
    <div className={`bg-white rounded-3xl h-fit py-12 px-10 shadow-xl ${width}`}>
      {children}
    </div>
  )
}

export default Form