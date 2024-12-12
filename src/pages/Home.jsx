import Button from '@/components/Button/Button';
import Level from '@/components/Level.jsx';
import Class from '@/components/Class.jsx';
import Confirmation from '@/components/Confirmation.jsx';
import HomeClass from '@/components/HomeClass.jsx';
import { useTranslation } from "react-i18next";
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

const Home = () => {
    const [, setLocation] = useLocation();
    const { t } = useTranslation();

    return (
        <>
            <div className="header-gradient p-4 min-h-[60dvh] flex items-center justify-center">
                <div className="text-center md:text-left mb-12 mt-12 px-5 justify-items-center">
                    <p className="text-2xl text-blue-600 mb-3">{t("home_motto")}</p>
                    <h1 className="text-5xl font-extrabold mb-6">{t("home_title")}</h1>
                    <p className="text-lg">{t("home_purpose")}</p>
                    <p className="text-sm mb-4"><b>300+</b> {t("home_student_desc")}</p>
                    <div className="flex flex-col md:flex-row items-center space-x-3">
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

            <div className="flex flex-col bg-white px-4 py-40 gap-32 mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="grid grid-cols-2 justify-center w-1/2 gap-8 md:gap-4 lg:gap-6 mb-6 md:mb-0">
                        <Level level={level1} isSimplified={false} />
                        <Level level={level4} isSimplified={false} />
                    </div>

                    <div className={`px-2 md:px-0 text-center w-[484px] md:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">{t("home_class_level_title")}</h2>
                        <p className="text-2xl mb-4">{t("home_class_level_desc")}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-around items-center">
                    <div className={`px-2 md:px-0 text-center w-[484px] md:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">{t("home_level_title")}</h2>
                        <p className="text-2xl mb-4">{t("home_level_desc")}</p>
                    </div>

                    <div className="flex flex-col first-line:items-center md:flex-row space-x-4">
                        <HomeClass classObj={class1} className=" w-48 h-32 md:w-26 md:h-40" />
                        <HomeClass classObj={class2} className="w-48 h-32 md:w-26 md:h-40" />
                    </div>
                </div>

                <div className="flex flex-row justify-around items-center">
                    <div className="flex flex-col items-center  md:flex-row space-x-4">
                        <Confirmation classObj={class1} className="w-48 h-32 md:w-56 md:h-40" />
                    </div>

                    <div className={`px-2 md:px-0 text-center w-[484px] md:text-left`}>
                        <h2 className="text-4xl font-semibold mb-5">{t("home_learn_title")}</h2>
                        <p className="text-2xl mb-4">{t("home_learn_desc")}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
