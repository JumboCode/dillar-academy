// import Button from "@/components/Button.jsx"

const FormSubmit = ({ label, isDisabled }) => {
    return (
        <button
            type="submit"
            className={`mw-1/5 px-6 py-2 ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-dark-blue-800 hover:bg-dark-blue-700 transition duration-300'} text-white font-normal rounded-lg`}
            disabled={isDisabled}
        >
            {label}
        </button>
    )
}

export default FormSubmit