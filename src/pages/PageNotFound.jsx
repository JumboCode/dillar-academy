
import Button from '../components/Button';

const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center h-5/6">
            <div>
                <h1 className="flex items-center justify-center h-5/6 text-6xl mb-2 font-bold pt-5 py-5" >Page Not Found</h1>
                <h2 className="flex items-center justify-center text-3xl mb-2 font-normal"> The page you're looking for doesn't exist.</h2>
                <div className='flex items-center justify-center space-x-5 whitespace-nowrap pt-8'> 
                    <Button
                        label={"Return Home"}
                        onClick={() => window.location.href = "/"}
                        isOutline={false}
                    />
                    <Button
                        label={"Get Help"}
                        onClick={() => window.location.href = "/"}
                        isOutline={true}
                    />
                </div>
                
            
            </div>

            
        </div>
    )
}

export default PageNotFound