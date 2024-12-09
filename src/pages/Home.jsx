import Button from '@/components/Button/Button';
import Level from '@/components/Level.jsx';
import Class from '@/components/Class.jsx';
import Confirmation from '@/components/Confirmation.jsx';
import LevelCard from '@/components/HomeLevel.jsx';
import HomeClass from '@/components/HomeClass.jsx';
import { useLocation } from 'wouter';

const class1 = {
    level: "1",
    ageGroup: "Children",
    instructor: "Subhat",
    schedule: [
      {
        day: "Saturday",
        time: "10:00 AM PST"
      },
      {
        day: "Sunday",
        time: "10:00 AM CST"
      }
    ]
};

const class2 = {
    level: "1",
    ageGroup: "Adult",
    instructor: "Ehtibar",
    schedule: [
      {
        day: "Saturday",
        time: "11:00 AM PST"
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

            <div className="flex flex-col bg-white p-4 gap-32 mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-4 lg:gap-6 mb-6 md:mb-0">
                        <LevelCard
                            imageSource="src/assets/level-1-img.png"
                            title="Level 1"
                            subtitle="Alphabet & Phonetics"
                            topics={['Alphabet', 'Basic Conversations', 'Basic Vocabulary']}
                        />
                        <LevelCard
                            imageSource="src/assets/level2-image.png"
                            title="Level 5"
                            subtitle="Advanced Reading & Writing"
                            topics={['Advanced Reading', 'Essays', 'Basic Vocabulary']}
                        />
                    </div>

                    <div className="px-4 text-center md:text-left md:w-[484px]">
                        <h2 className="text-4xl font-semibold mb-5">Choose your class level</h2>
                        <p className="text-2xl mb-4">We offer multiple levels of English classes based on your experience.</p>
                    </div>
                </div>

                <div className="flex flex-row justify-around items-center">
                    <div className={`px-2 md:px-0 text-center w-[484px] md:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">Find a time and instructor</h2>
                        <p className="text-2xl mb-4">Choose a class time that works for you or an instructor who’s teaching style you like!</p>
                    </div>

                    <div className="flex flex-col first-line:items-center md:flex-row space-x-4">
                        <HomeClass classObj={class1} className=" w-48 h-32 md:w-26 md:h-40"/>
                        <HomeClass classObj={class2} className="w-48 h-32 md:w-26 md:h-40"/>
                    </div>
                </div>

                <div className="flex flex-row justify-around items-center">
                    <div className="flex flex-col items-center  md:flex-row space-x-4">
                        <Confirmation classObj={class1} className="w-48 h-32 md:w-56 md:h-40"/>
                    </div>

                    <div className={`px-2 md:px-0 text-center w-[484px] md:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">Start Learning</h2>
                        <p className="text-2xl mb-4">Attend class and start learning right away!</p>
                    </div>
                </div>
            </div>

            <footer className="h-80 bg-dark-blue-800 text-white flex flex-col justify-center gap-y-5">
                <p className="text-4xl font-extrabold mx-20">Dillar English Academy</p>
                <p className="text-lg mx-20">Email: dillarenglish@gmail.com</p>
                <p className = "text-lg mx-20">Instagram: @dillaracademy</p>
            </footer>
        </>
    );
};

export default Home;
