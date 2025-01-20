import stepping_stones_landscape from '../assets/stones.png';
import { useTranslation } from "react-i18next";
import { IoStar } from "react-icons/io5";

function About() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center sm:items-stretch sm:flex-row-reverse sm:justify-between sm:h-full py-10 sm:py-40 xl:px-16 md:px-6 px-4">
      <div className="flex items-center justify-center sm:w-1/3">
        <img src={stepping_stones_landscape} alt="stepping_stones_landscape" className="rounded-3xl shadow-xl aspect-square" title="stepping_stones_landscape"></img>
      </div>
      <div className="my-auto sm:w-7/12 sm:text-lg">
        <h1 className="text-4xl py-5 sm:text-5xl text-center sm:text-left font-extrabold text-blue-700 inline-flex items-center">
          <IoStar
            style={{ fontSize: '40px' }}
            color="steelblue"
            className="mr-2"
          />
          {t("about_heading")}
        </h1>
        <p>{t("about_desc_1")}
          <br /><br />
          {t("about_desc_2")}
        </p>
      </div>
    </div>
  )
}

export default About;
