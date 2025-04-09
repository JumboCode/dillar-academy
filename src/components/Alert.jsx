
const Alert = ({ message }) => {
    return (
        <div className="border-l-4 p-4 bg-red-100 text-red-800 rounded-xl border-red-300 fixed top-28 z-30">
            <p className="sm:text-lg"> {message} </p>
        </div>
    );
};

export default Alert;