import { useState, useEffect } from "react";
import { LuPencil } from "react-icons/lu";
import { toTitleCase } from '@/utils/formatters';

const UserItem = ({ userData, privilege, isShowClass }) => {
  const [highestClass, setHighestClass] = useState(undefined);

  useEffect(() => {
    const maxClass = userData.enrolledClasses.length > 0
      ? userData.enrolledClasses
        .slice()
        .sort((a, b) => {
          // order IELTS > numbers > conversation
          const getPriority = (cls) => {
            if (cls.level === "ielts") return 1000;
            if (typeof cls.level === "number") return 500 + cls.level;
            if (cls.level === "conversation") return 0;
            return -1; // handle unknown levels
          };

          return getPriority(b) - getPriority(a); // sort in descending order
        })[0]
      : null;
    setHighestClass(maxClass);
  }, [userData]);

  if (!userData) {
    return <></>;
  }

  return (
    <div className="group flex py-3 px-4 justify-between items-center hover:bg-[#ECF7FE] space-x-3 w-full rounded-sm flex-space-between">
      <div className="flex-1 min-w-0 *:truncate *:w-full">
        <p
          title={`Name: ${toTitleCase(userData.firstName)} ${toTitleCase(userData.lastName)}`}
          className="text-gray-900 font-semibold">
          {toTitleCase(userData.firstName)} {toTitleCase(userData.lastName)}
        </p>
        <p
          title={`Email: ${userData.email}`}
          className="flex text-gray-500 text-sm">
          {userData.email}
        </p>
        <p
          className="flex text-gray-500 text-sm">
        </p> {/* TODO: add phone */}
        <div>
          {userData.privilege !== "instructor" && isShowClass && (
            <p className="text-gray-500 text-sm">
              {/* Level ${toTitleCase(highestClass.level)}: */}
              {highestClass ? (
                `Level ${highestClass.level === "ielts"
                  ? "IELTS"
                  : highestClass.level === "conversation"
                    ? "Conversation"
                    : highestClass.level}: 
                ${highestClass.ageGroup === "all"
                  ? "All Ages"
                  : `${highestClass.ageGroup.charAt(0).toUpperCase() +
                  highestClass.ageGroup.slice(1)}'s Class`}`
              ) : (
                "No Enrollment"
              )}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 md:hidden group-hover:block">
        {privilege === "admin" &&
          <LuPencil className="text-lg" />
        }
      </div>
    </div >
  );
};

export default UserItem;