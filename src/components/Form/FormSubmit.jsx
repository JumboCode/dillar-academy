// import Button from "@/components/Button.jsx"

const FormSubmit = ({ label, isDisabled }) => {
    return (
        <button
            type="submit"
            className={`w-full py-3 ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 transition duration-300'} text-white font-semibold rounded-lg`}
            disabled={isDisabled}
        >
            {label}
        </button>
    )
}

export default FormSubmit