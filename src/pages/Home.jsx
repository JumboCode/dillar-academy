import Button from '@/components/Button/Button';
import Level from '@/components/Class/Level';
import Confirmation from '@/components/Confirmation';
import { useTranslation } from "react-i18next";
import { useLocation } from 'wouter';
import { IoTimeOutline, IoCalendarOutline, IoStar } from "react-icons/io5";

const HomeClass = ({ classObj }) => {
  const day1 = classObj.schedule[0].day.toString();
  const subDay1 = day1.substr(0, 3);
  const time = classObj.schedule[0].time.toString();
  const day2 = classObj.schedule[1].day.toString();
  const subDay2 = day2.substr(0, 3);

  return (
    <div className="p-6 bg-white rounded-xl overflow-hidden w-full">
      <div className="flex flex-col gap-1.5">
        {/* Header */}
        <div>
          <h3 className="font-extrabold mb-1">{classObj.ageGroup}'s Class</h3>
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
          <div
            className={`bg-gradient-to-r from-dark-blue-100 via-blue-100 to-turquoise-200 py-2 px-4 rounded-sm text-neutral-400 font-extrabold transition-colors duration-300 w-full`}
          >
            Register
          </div>
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

  // const stepStyle = 

  return (
    <>
      {/* hero section */}
      <div className="header-gradient min-h-[60svh] flex flex-col items-center justify-center w-full py-12 px-10 text-center md:text-left">
        <h3 className="text-blue-600 mb-3">{t("home_motto")}</h3>
        <h1 className="font-extrabold text-4xl sm:text-5xl mb-6">Dillar Academy</h1>
        <p className="text-base sm:text-xl">{t("home_purpose")}</p>
        <p className="mb-4"><b>300+</b> {t("home_student_desc")}</p>
        <div className="flex gap-x-3 items-center">
          <Button
            label={"Explore Classes"}
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
      {/* Learn more section */}
      <div className="flex flex-col items-center w-full max-w-[96rem] py-20 md:py-40 px-4 sm:px-6 lg:px-20 xl:px-40 gap-y-10 sm:gap-y-28">
        <div className='flex gap-x-4 items-center'>
          <IoStar
            style={{ fontSize: '32px' }}
            className="text-blue-700"
          />
          <h2 className='font-extrabold text-3xl sm:text-4xl text-blue-700'>How to Sign Up for Classes</h2>
        </div>
        <div className="flex flex-col gap-y-28 md:gap-y-40">
          {/* About levels */}
          <div className="w-full flex flex-col-reverse items-center md:grid md:grid-cols-2 md:gap-x-10 xl:gap-x-28 sm:justify-items-center">
            <div className="w-full grid grid-cols-1 gap-y-6 md:gap-x-4 md:grid-cols-2 pointer-events-none">
              <div className="rounded-xl shadow-[0px_4px_16px_0px_rgba(76,75,99,0.12),_-20px_-8px_60px_0px_rgba(197,190,248,0.40)]">
                <Level level={level1} isSimplified={false} />
              </div>
              <div className="rounded-xl shadow-[0px_4px_16px_0px_rgba(7,79,120,0.12),20px_8px_60px_0px_rgba(183,226,251,0.40)]">
                <Level level={level4} isSimplified={false} />
              </div>
            </div>
            <div className={`text-center md:text-left mb-10 md:mb-0`}>
              <h3 className="font-extrabold text-xl sm:text-[1.75rem] sm:leading-8 mb-3 md:mb-4">1. {t("home_class_level_title")}</h3>
              <p className="text-lg sm:text-2xl">{t("home_class_level_desc")}</p>
            </div>
          </div>
          {/* About classes */}
          <div className="w-full flex flex-col items-center md:grid md:grid-cols-2 md:gap-x-10 xl:gap-x-28 sm:justify-items-center">
            <div className={"text-center md:text-left mb-10 md:mb-0"}>
              <h3 className="font-extrabold text-xl sm:text-[1.75rem] sm:leading-8 mb-3 md:mb-4">2. {t("home_level_title")}</h3>
              <p className="text-lg sm:text-2xl">{t("home_level_desc")}</p>
            </div>
            <div className="w-full flex flex-col gap-y-6 md:gap-x-4 md:grid md:grid-cols-2">
              <div className='rounded-xl shadow-[0px_4px_16px_0px_rgba(76,75,99,0.12),_-20px_-8px_60px_0px_rgba(197,190,248,0.40)]'>
                <HomeClass classObj={class1} />
              </div>
              <div className="rounded-xl shadow-[0px_4px_16px_0px_rgba(7,79,120,0.12),20px_8px_60px_0px_rgba(183,226,251,0.40)]">
                <HomeClass classObj={class2} />
              </div>
            </div>
          </div>
          {/* About registering */}
          <div className="w-full flex flex-col-reverse items-center md:grid md:grid-cols-2 md:gap-x-10 xl:gap-x-28 sm:justify-items-center">
            <div className="flex flex-col items-center w-full">
              <Confirmation classObj={class1} />
            </div>
            <div className='text-center md:text-left mb-10 md:mb-0'>
              <h3 className="font-extrabold text-xl sm:text-[1.75rem] sm:leading-8 mb-3 md:mb-4">3. {t("home_learn_title")}</h3>
              <h3 className="text-lg sm:text-2xl">{t("home_learn_desc")}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;
