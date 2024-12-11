import Button from '../components/Button/Button';
import LanguageDropdown from '../components/Dropdown/LanguageDropdown';
import { Link, useLocation } from 'wouter';

const Welcome = ({ onComplete }) => {
    const [, setLocation] = useLocation();

    return (
        <>
            <div className="bg-blue-200 p-4 h-full min-h-[60dvh] flex items-center justify-center">
                <div className="text-center mb-12 mt-12 px-5">
                    <h1 className="text-6xl font-bold mb-2">Dillar Academy</h1>
                    <p className="mb-4">Free English education for Uyghurs around the world.</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-x-2 mb-2">
                        <div className='px-2 rounded-lg transition-colors duration-300 border border-dark-blue-800 bg-white'>
                            <LanguageDropdown />
                        </div>
                        <Button
                            href="/SignUp"
                            label={"Start Learning"}
                            onClick={() => {
                                onComplete()
                                setLocation("/signup")
                            }}
                            isOutline={false}
                        />
                    </div>
                    <h3 className='hover:text-blue-500 transition-colors'> <Link href="/login" onClick={onComplete}> Already have an account? </Link> </h3>
                </div>
            </div>
        </>
    );
};

export default Welcome;
