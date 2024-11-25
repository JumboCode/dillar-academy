import Button from '../components/Button';
import LanguageDropdown from '../components/Dropdown/LanguageDropdown';
import NavLink from '../components/NavBar/NavLink';
import { Link, useLocation } from 'wouter';

const Welcome = () => {
    const [location, setLocation] = useLocation();
    return (
        <>
            <div className="bg-[#26769B] p-4 h-full min-h-[60dvh] flex place-content-center ">
                <div className="text-center text-center mb-12 mt-12 px-5">
                    <h1 className="text-white text-6xl font-bold mb-2">Dillar Academy</h1>
                    <p className="text-white mb-4">Free English education for Uyghurs around the world.</p>
                    <div className="flex flex-col md:flex-row place-content-center">
                        <LanguageDropdown
                        />
                        
                        <Button
                            href = "/SignUp"
                            label={"Start Learning"}
                            onClick={() => setLocation("/Signup")}
                            isOutline={true}
                        />
                    </div>
                    <h3> <Link href="/Login"> Already have an account? </Link> </h3>
                    
                </div>
            </div>
        </>
    );
};

export default Welcome;
