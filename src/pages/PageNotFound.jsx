
import Button from '../components/Button';

const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center h-5/6">
            <div>
                <h1 className="flex items-center justify-center h-5/6 text-6xl mb-2 font-bold pt-5 py-5" >Page Not Found</h1>
                <h2 className="flex items-center justify-center text-3xl mb-2 font-normal"> The page you're looking for doesn't exist.</h2>
                <div className='flex items-center justify-center space-x-5 whitespace-nowrap pt-8'> 
                    <button className="p-2 bg-indigo-950 px-5 text-white rounded-xl" onClick={
                        () => {
                            window.location.href = "/"; // Redirect to home page
                        } }>
                        Return Home
                    </button>
                    <button className="p-2 px-5 border-indigo-950 border-8" style={{
                        borderRadius: '10px',
                        borderWidth: '1px',
                        borderColor: 'black'
                    }} onClick={
                        () => {
                            window.location.href = "/"; // Redirect to home page
                        } }>
                        Get Help
                    </button>
                </div>
                
            
            </div>

            
        </div>
    )
}

export default PageNotFound