
const FormInput = ({ type, name, placeholder, value, onChange, onKeyDown = null, isRequired }) => {
    const styles = "text-base sm:text-lg w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500";

    return (
        type === "textarea" ?
            <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className={styles}
                required={isRequired}
                rows={5}
            /> :
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                required={isRequired}
                className={styles}
            />
    )
}

export default FormInput