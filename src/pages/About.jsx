import stepping_stones_landscape from '../assets/stones.png';
import { useTranslation } from "react-i18next";
import { IoStar } from "react-icons/io5";

function About() {
  const { t } = useTranslation();

  return (
    <div className="page-format max-w-[96rem] flex flex-col py-20 lg:py-24 gap-20">
      <section className='flex flex-col lg:flex-row-reverse lg:justify-between items-center'>
        <div className="flex items-center justify-center lg:w-1/3">
          <img src={stepping_stones_landscape} alt="stepping_stones_landscape" className="rounded-3xl shadow-xl lg:aspect-square object-cover" title="stepping_stones_landscape"></img>
        </div>
        <div className="my-8 lg:w-7/12 sm:text-lg">
          <div className="w-full flex gap-x-4 items-center justify-center lg:justify-start mb-4 sm:mb-7">
            <IoStar
              style={{ fontSize: '32px' }}
              className="text-blue-700"
            />
            <h1 className="font-extrabold text-3xl sm:text-[2.5rem] text-blue-700">{t("about_heading")}</h1>
          </div>
          <p>{t("about_body1")}
            <br /><br />
            {t("about_body2")}
          </p>
        </div>
      </section>
      <section>
        <h1 className='font-extrabold'>Privacy Commitment</h1>
      </section>
    </div>
  )
}

export default About;
