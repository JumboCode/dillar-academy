
import Button from '../components/Button';

const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center h-5/6">
            <div>
                <h1 className="flex items-center justify-center h-5/6 text-6xl mb-2 font-bold" >Page Not Found</h1>
           
                <h2 className="flex items-center justify-center text-3xl mb-2 font-normal" style={{
                    paddingTop: '20px'
                }}> The page you're looking for doesn't exist.</h2>
                <div className='flex items-center justify-center space-x-5 whitespace-nowrap font-bold pt-8'> 
                    <button className="p-2 bg-neutral-800 px-5 text-white" style={{
                        borderRadius: '10px'
                    }} onClick={
                        () => {
                            window.location.href = "/"; // Redirect to home page
                        } }>
                        Return Home
                    </button>
                    <button className="p-2 px-5 " style={{
                        borderRadius: '10px',
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