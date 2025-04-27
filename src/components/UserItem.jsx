import { useState, useEffect, useContext } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { LuPencil } from "react-icons/lu";

const UserItem = ({ userData, classes = [], isShowClass }) => {
  const { user } = useContext(UserContext);
  const [highestClass, setHighestClass] = useState(undefined);

  useEffect(() => {
    const filteredClasses = classes.filter(cls =>
      userData.enrolledClasses.some(enrolled => enrolled._id === cls._id));

    const maxClass = filteredClasses.length > 0
      ? filteredClasses.reduce((prev, curr) => (curr.level > prev.level ? curr : prev))
      : null;
    setHighestClass(maxClass);
  }, [classes, userData]);

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className="group flex py-3 px-4 justify-between items-center hover:bg-sky-100 space-x-3 w-full rounded-sm flex-space-between">
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
              {highestClass ? (
                highestClass.ageGroup === "all" ? (
                  `Level ${highestClass.level}: All Ages`
                ) : (
                  `Level ${highestClass.level}: ${highestClass.ageGroup.charAt(0).toUpperCase() +
                  highestClass.ageGroup.slice(1)}'s Class`
                )
              ) : (
                "No Enrollment"
              )}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 hidden group-hover:block">
        {user.privilege === "admin" &&
          <LuPencil className="text-lg" />
        }
      </div>
    </div>
  );
};

export default UserItem;