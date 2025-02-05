import Button from '@/components/Button/Button';
import Level from '@/components/Level.jsx';
import Confirmation from '@/components/Confirmation.jsx';
import { useTranslation } from "react-i18next";
import { useLocation } from 'wouter';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";

const HomeClass = ({ classObj }) => {
    const day1 = classObj.schedule[0].day.toString();
    const subDay1 = day1.substr(0, 3);
    const time = classObj.schedule[0].time.toString();
    const day2 = classObj.schedule[1].day.toString();
    const subDay2 = day2.substr(0, 3);

    return (
        <div className="p-4 bg-white rounded-xl shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow w-full">
            <div className="flex flex-col gap-1.5">
                {/* Header */}
                <div>
                    <h3 className="text-2xl font-bold mb-1">{classObj.ageGroup}'s Class</h3>
                    <p>  w/ {classObj.instructor} </p>
                </div>
                {/* Schedule */}
                <div className="flex flex-col text-neutral-400 text-sm mb-2">
                    <div className="flex items-left gap-2">
                        <IoCalendarOutline className="text-lg" />
                        <span>{subDay1} & {subDay2}</span>
                    </div>
                    <div className="flex items-left gap-2">
                        <IoTimeOutline className="text-lg" />
                        <span>{time}</span>
                    </div>
                </div>
                <div className='gap-3 w-24'>
                    <button
                        className={`bg-gradient-to-r from-dark-blue-100 via-blue-100 to-turquoise-200 px-2 py-2 rounded-lg text-neutral-400 font-semibold transition-colors duration-300 w-full`}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

const Home = () => {
    const [, setLocation] = useLocation();
    const { t } = useTranslation();

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

    const level1 = {
        level: "1",
        name: "Alphabet and Phonetics",
        instructors: ["Subat", "Ehtibar"]
    }
    const level4 = {
        level: "4",
        name: "Higher Level Writing",
        instructors: ["Dilziba"]
    }

    return (
        <>
            {/* hero section */}
            <div className="header-gradient p-4 min-h-[60dvh] flex items-center justify-center">
                <div className="text-center md:text-left mb-12 mt-12 px-5 justify-items-center">
                    <p className="text-2xl text-blue-600 mb-3">{t("home_motto")}</p>
                    <h1 className="text-5xl font-extrabold mb-6">Dillar English Academy</h1>
                    <p className="text-xl">{t("home_purpose")}</p>
                    <p className="text-l mb-4"><b>300+</b> {t("home_student_desc")}</p>
                    <div className="flex flex-col space-y-2 sm:flex-row items-center sm:space-y-0 sm:space-x-3">
                        <Button
                            label={t("home_learn_title")}
                            onClick={() => setLocation("/signup")}
                            isOutline={false}
                        />
                        <Button
                            label={t("learn_more")}
                            onClick={() => setLocation("/about")}
                            isOutline={true}
                        />
                    </div>
                </div>
            </div>
            {/* Learn more section */}
            <div className="flex flex-col bg-white px-4 py-20 gap-y-20 md:gap-32 mx-auto max-w-7xl">
                {/* About levels */}
                <div className="flex flex-col-reverse gap-4 sm:flex-row justify-around items-center">
                    <div className="grid grid-cols-1 w-4/5 sm:gap-4 sm:w-auto sm:grid-cols-2 justify-center gap-8 ">
                        <Level level={level1} isSimplified={false} />
                        <Level level={level4} isSimplified={false} />
                    </div>
                    <div className={`px-2 md:px-0 text-center w-[484px] sm:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">{t("home_class_level_title")}</h2>
                        <p className="text-2xl mb-4">{t("home_class_level_desc")}</p>
                    </div>
                </div>
                {/* About classes */}
                <div className="flex flex-col gap-4 sm:flex-row justify-around items-center">
                    <div className={"px-2 md:px-0 text-center w-[484px] md:text-left"}>
                        <h2 className="text-4xl font-semibold mb-5">{t("home_level_title")}</h2>
                        <p className="text-2xl mb-4">{t("home_level_desc")}</p>
                    </div>
                    <div className="flex flex-col w-4/5 sm:w-auto sm:gap-4 gap-8 sm:flex-row md:space-x-4">
                        <HomeClass classObj={class1} />
                        <HomeClass classObj={class2} />
                        {/* <HomeClass classObj={class1} className= "w-48 h-32 md:w-26  md:h-40" />
                        <HomeClass classObj={class2} className= "w-48 h-32 md:w-26 md:h-40" /> */}
                    </div>
                </div>
                {/* About registering */}
                <div className="flex flex-col-reverse gap-4 sm:flex-row justify-around items-center">
                    <div className="flex flex-col items-center md:flex-row space-x-4">
                        <Confirmation classObj={class1} className="w-48 h-32 md:w-56 md:h-40"/>
                    </div>
                    <div className={`px-2 md:px-0 text-center w-[484px] md:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">{t("home_learn_title")}</h2>
                        <p className="text-2xl mb-4">{t("home_learn_desc")}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;
