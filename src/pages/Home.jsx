
import dummyBg from '@/assets/dummy-bg.png';
import Button from '@/components/Button/Button';
import Level from '@/components/Level.jsx';
import Class from '@/components/Class.jsx';
import Confirmation from '@/components/Confirmation.jsx';
import { useLocation } from 'wouter';

const sections = [
    {
        imgSrc: dummyBg,
        imgAlt: "dummy-bg1",
        title: "Choose your class level",
        description: "Take a quick assessment to see what your English level is like!",
    },
    {
        imgSrc: dummyBg,
        imgAlt: "dummy-bg2",
        title: "Find a time and instructor",
        description: "Browse our list of classes to find one that works!",
    },
    {
        imgSrc: dummyBg,
        imgAlt: "dummy-bg3",
        title: "Start Learning",
        description: "Attend class and start learning right away!",
    },
];

const class1 = {
    level: "1",
    ageGroup: "adults",
    instructor: "Ehtibar",
    schedule: [
      {
        day: "Saturday",
        time: "10:00 AM CST"
      },
      {
        day: "Sunday",
        time: "10:00 AM CST"
      }
    ]
};

const class2 = {
    level: "1",
    ageGroup: "children",
    instructor: "Subat",
    schedule: [
      {
        day: "Saturday",
        time: "11:00 AM CST"
      },
      {
        day: "Sunday",
        time: "11:00 AM CST"
      }
    ]
  };

const Home = () => {
    const [, setLocation] = useLocation();

    return (
        <>
            <div className="bg-gradient-to-r from-white via-blue-1000 to-blue-900 p-4 min-h-[60dvh] flex items-center justify-center">
                <div className="text-center md:text-left mb-12 mt-12 px-5 justify-items-center">
                    <p className="text-2xl text-blue-600 mb-3">Stop Learning. Start Knowing.</p>
                    <h1 className="text-5xl font-extrabold mb-6 ">Dillar English Academy</h1>
                    <p className="text-lg">Free English education for Uyghurs around the world.</p>
                    <p className="text-sm mb-4"><b>300+</b> students and growing!</p>
                    <div className="flex flex-col md:flex-row items-center space-x-3">
                        <Button
                            label={"Start Learning"}
                            onClick={() => setLocation("/signup")}
                            isOutline={false}
                        />
                        <Button
                            label={"Learn More"}
                            onClick={() => setLocation("/about")}
                            isOutline={true}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 mt-4">
                {/* <h1 className="text-4xl font-extrabold mb-10 text-center">How It Works</h1> */}
                {sections.map((section, index) => (
                    <div key={index} className={`flex flex-col md:flex-row items-center justify-evenly px-4 md:px-2 mb-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    
                        {section.title === "Choose your class level" && (
                            <div className="flex flex-col items-center  md:flex-row space-x-4 md:w-2/3">
                                <Level level="1" isSimplified={true} className="w-48 h-32 md:w-56 md:h-40"/>
                                <Level level="2" isSimplified={true} className="w-48 h-32 md:w-56 md:h-40"/>
                            </div>
                        )}

                        {section.title === "Find a time and instructor" && (
                            <div className="flex flex-col items-center  md:flex-row space-x-4 md:w-2/3">
                                <Class classObj={class1} className="w-48 h-32 md:w-56 md:h-40"/>
                                <Class classObj={class2} className="w-48 h-32 md:w-56 md:h-40"/>
                            </div>
                        )}

                        {/* could be slower with the if checks so we shouldn't do it like that */}
                        {section.title === "Start Learning" && (
                            <div className="flex flex-col items-center  md:flex-row space-x-4 md:w-2/3">
                                <Confirmation classObj={class1} className="w-48 h-32 md:w-56 md:h-40"/>
                            </div>
                        )}  

                        {/* <img src={section.imgSrc} alt={section.imgAlt} className="mb-4 md:mb-8 md:w-1/3 rounded-lg shadow-md" /> */}
                        <div className={`px-2 md:px-0 text-center md:text-left md:w-1/3`}>
                            <h2 className="text-4xl font-semibold mb-5">{section.title}</h2>
                            <p className="text-2xl mb-4">{section.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <footer className="h-80 bg-dark-blue-800 text-white flex flex-col justify-center gap-y-5">
                {/* is there a better way of doing this so that mx-20 isn't repeated 3 times? */}
                <p className="text-4xl font-extrabold mx-20">Dillar English Academy</p>
                <p className="text-lg mx-20">Email: dillarenglish@gmail.com</p>
                <p className = "text-lg mx-20">Instagram: @dillaracademy</p>
            </footer>
        </>
    );
};

export default Home;
