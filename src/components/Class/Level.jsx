import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { interpolateHsl } from 'd3-interpolate';
import { useTranslation } from "react-i18next";
import { localizeNumber } from "@/utils/formatters";

const Level = ({ level, isSimplified, isArrowRight, numLevels }) => {
  const hslInterpolator = interpolateHsl("#F7FBFD", "#1C5773");
  const isString = typeof level.level === "string";
  const levelColor = isString ? "#594BD2" : hslInterpolator(level.level / numLevels);
  const { t, i18n } = useTranslation();

  return isSimplified ? (
    <div className="h-full shadow-shadow hover:shadow-shadow-hover transition-shadow rounded-2xl">
      <div
        className={`h-full py-8 px-7 flex ${isArrowRight ? "" : "flex-row-reverse"} gap-x-3 items-center justify-between bg-white rounded-2xl overflow-hidden transition-shadow`}
        style={{ boxShadow: isArrowRight ? `inset -0.5em 0 ${levelColor}` : `inset 0.5em 0 ${levelColor}` }}>
        <div className={`w-full flex flex-col ${isArrowRight ? "sm:flex-row-reverse" : "sm:flex-row"} sm:justify-between sm:items-center`}>
          <h3 className="font-extrabold text-dark-blue-800">
            {isString ? t(`${level.level}_level`) : t('level_num', { num: localizeNumber(level.level, i18n.language), ns: "levels" })}
          </h3>
          <p className="text-neutral-600">{level._id ? t(`level_name_${level._id}`, { ns: "levels" }) : ""}</p>
        </div>
        {isArrowRight ? <IoChevronForward className="text-2xl text-[#2F2F32]" /> : <IoChevronBack className="text-2xl text-[#2F2F32]" />}
      </div>
    </div>
  ) : (
    <div className="w-full h-full rounded-2xl shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-2">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-8 row-start-2 rounded-b-2xl space-y-1">
        <h3 className='font-extrabold'>
          {isString ? t(`${level.level}_level`) : t('level_num', { num: localizeNumber(level.level, i18n.language), ns: "levels" })}
        </h3>
        <p className="text-base sm:text-lg">{t(`level_name_${level._id}`, { ns: "levels" })}</p>
      </div>
    </div>
  )
}

export default Level