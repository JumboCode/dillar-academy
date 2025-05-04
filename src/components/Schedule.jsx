import { useEffect, useState } from "react";
import { useLocation, Link } from 'wouter';
import Button from '@/components/Button/Button';
import EditButton from '@/components/Button/EditButton';
import { useTranslation } from "react-i18next";
import { localizeNumber, toTitleCase } from "@/utils/formatters";

const Schedule = ({ privilege, classes, filters = [] }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="table w-full table-fixed">
      <div className="table-header-group">
        <div className="table-row">
          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, index, array) => (
            <div
              key={day}
              className={`table-cell text-center font-semibold sm:p-2 ${index !== array.length - 1 ? 'border-r border-gray-300' : ''}`}
            >
              {/* TODO: check that these abbr are correct as well */}
              {(() => {
                switch (i18n.language) {
                  case 'tr':
                    return (
                      isMobile
                        ? t(`${day}_abbr`)[0]
                        : t(`${day}_abbr`).toUpperCase()
                    );
                  case 'ru':
                    return t(`${day}_abbr`).toUpperCase();
                  case 'ug':
                    return (
                      isMobile
                        ? t(`${day}_abbr`)[0]
                        : t(`${day}_abbr`).toUpperCase()
                    );
                  case 'zh':
                    return (isMobile ? t(`${day}_abbr`)[1] : t(`${day}_abbr`));
                  default: // en
                    return (
                      isMobile
                        ? ['sat', 'sun', 'tue', 'thu'].includes(day)
                          ? t(`${day}_abbr`).slice(0, 2)
                          : t(`${day}_abbr`)[0]
                        : t(`${day}_abbr`).toUpperCase()
                    );
                }
              })()}
            </div>
          ))}
        </div>
      </div>
      <div className="table-row-group">
        <div className="table-row h-24">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index, array) => (
            <div
              key={day}
              className={`table-cell p-[.125rem] sm:p-2 align-top ${index !== array.length - 1 ? 'border-r border-gray-300' : ''}`}
            >
              {classes
                .flatMap(classObj => classObj.schedule.map(schedule => (
                  {
                    ...schedule,
                    _id: classObj._id,
                    level: classObj.level,
                    ageGroup: classObj.ageGroup,
                    instructor: classObj.instructor,
                    link: classObj.link
                  })))
                .filter(schedule => schedule.day.slice(0, 3).toUpperCase() === day)
                .filter(schedule => filters.length === 0 || filters.includes(schedule.level))
                .sort((a, b) => new Date(`1970/01/01 ${a.startTime}`) - new Date(`1970/01/01 ${b.startTime}`)) // Sort by time
                .map((classObj, index) => {
                  const classElement = <ScheduleClass key={index} classObj={classObj} isMobile={isMobile} privilege={privilege} />;

                  if (isMobile) {
                    switch (privilege) {
                      case "admin":
                        return (
                          <Link key={index} to={`/admin/levels/class/${classObj._id}`}>
                            {classElement}
                          </Link>
                        );
                      case "instructor":
                        return (
                          <Link key={index} to={`/instructor/class/${classObj._id}`}>
                            {classElement}
                          </Link>
                        );
                      case "student":
                        return (
                          <a key={index} href={classObj.link}>
                            {classElement}
                          </a>
                        );
                      default:
                        return classElement;
                    }
                  }

                  return classElement;
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ScheduleClass = ({ privilege, classObj, isMobile }) => {
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-blue-100 rounded-xs sm:rounded-sm border-[0.5px] border-gray-200 p-1 sm:p-3 mb-1 sm:mb-2">
      <p className="text-blue-700 text-[0.75rem] sm:text-[0.875rem] text-balance">{classObj.startTime || "N/A"}-{classObj.endTime || "N/A"}</p>
      <p
        title={t('level_num', {
          num: typeof classObj.level === "string"
            ? toTitleCase(classObj.level)
            : localizeNumber(classObj.level, i18n.language),
          ns: "levels"
        })}
        className="font-extrabold text-[0.75rem] sm:text-[0.875rem] sm:mt-2 truncate"
      >
        {t('level_num', {
          num: typeof classObj.level === "string"
            ? toTitleCase(classObj.level)
            : localizeNumber(classObj.level, i18n.language),
          ns: "levels"
        })}
      </p>
      <p className="text-gray-800 text-[0.675rem] sm:text-xs sm:mb-3 break-words">
        {classObj.ageGroup === "all" ? t(`for_${classObj.ageGroup}`).toUpperCase() : t(`${classObj.ageGroup}_class`).toUpperCase()}
      </p>
      {!isMobile && (
        privilege === "student" ? (
          <a href={classObj.link}>
            {/* button overflowing in different languages */}
            <Button label={t('join')} onClick={null} isDisabled={classObj.link === ""} />
          </a>
        ) : <EditButton
          classId={classObj._id}
          editURL={
            privilege === "admin" ? (() => {
              switch (true) {
                case typeof classObj.level === "number":
                  return `/admin/levels/class`;
                case classObj.level === "conversation":
                  return `/admin/levels/conversations`;
                case classObj.level === "ielts":
                  return `/admin/levels/ielts`; // TODO:
              }
            })() : (() => {
              switch (true) {
                case typeof classObj.level === "number":
                  return `/instructor/class`;
                case classObj.level === "conversation":
                  return `/instructor/conversation`; // TODO:
                case classObj.level === "ielts":
                  return `/instructor/ielts`; // TODO:
              }
            })()
          }
        />
      )}
    </div>
  )
}

export default Schedule;