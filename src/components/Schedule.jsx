import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import Button from '@/components/Button/Button';

const Schedule = ({ classes }) => {
  const { user } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

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
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index, array) => (
            <div
              key={day}
              className={`table-cell text-center font-semibold sm:p-2 ${index !== array.length - 1 ? 'border-r border-gray-300' : ''}`}
            >
              {isMobile
                ? ['SAT', 'SUN', 'TUE', 'THU'].includes(day)
                  ? day[0] + day[1].toLowerCase()
                  : day[0]
                : day}
            </div>
          ))}
        </div>
      </div>
      <div className="table-row-group">
        <div className="table-row h-24">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index, array) => (
            <div
              key={day}
              className={`table-cell sm:p-2 align-top ${index !== array.length - 1 ? 'border-r border-gray-300' : ''}`}
            >
              {classes
                .flatMap(classObj => classObj.schedule.map(schedule => (
                  {
                    ...schedule,
                    _id: classObj._id,
                    level: classObj.level,
                    ageGroup: classObj.ageGroup,
                    instructor: classObj.instructor,
                    classroomLink: classObj.classroomLink
                  })))
                .filter(schedule => schedule.day.slice(0, 3).toUpperCase() === day)
                .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)) // Sort by time
                .map((classObj, index) => {
                  const classElement = <ScheduleClass key={index} classObj={classObj} isMobile={isMobile} />;

                  if (isMobile && user.privilege === "instructor") {
                    return (
                      <Link key={index} to={`/instructor/class/${classObj._id}`}>
                        {classElement}
                      </Link>
                    );
                  }

                  if (isMobile && user.privilege === "student") {
                    return (
                      <a key={index} href={classObj.classroomLink}>
                        {classElement}
                      </a>
                    );
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

const ScheduleClass = ({ classObj, isMobile }) => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  console.log(isMobile)

  return (
    <div className="bg-blue-100 rounded-sm border-[0.5px] border-gray-200 p-1 sm:p-3">
      <p className="text-blue-700 text-[0.75rem] sm:text-[0.875rem]">{classObj.time}</p>
      <p className="font-extrabold text-[0.75rem] sm:text-[0.875rem] sm:mt-2">Level {classObj.level}</p>
      <p className="text-gray-800 text-[0.675rem] sm:text-xs sm:mb-3">{classObj.ageGroup === "all" ? "ALL AGES" : `${classObj.ageGroup.toUpperCase()}'s CLASS`}</p>
      {!isMobile && (
        user.privilege === "instructor" ? (
          <Button label="Edit" onClick={() => setLocation(`/instructor/class/${classObj._id}`)} />
        ) : (
          <a href={classObj.classroomLink}>
            <Button label="Join" onClick={null} />
          </a>
        )
      )}
    </div>
  )
}

export default Schedule;