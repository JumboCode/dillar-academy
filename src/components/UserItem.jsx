import { useState, useEffect, useContext } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { LuPencil } from "react-icons/lu";

const UserItem = ({ userData, classes = [], isShowClass }) => {
  const { user } = useContext(UserContext);
  const [isHovering, setIsHovering] = useState(false);
  const [highestClass, setHighestClass] = useState(undefined);

  useEffect(() => {
    const filteredClasses = classes.filter(cls =>
      userData.enrolledClasses.some(enrolled => enrolled._id === cls._id));

    const maxClass = filteredClasses.length > 0
      ? filteredClasses.reduce((prev, curr) => (curr.level > prev.level ? curr : prev))
      : null;
    setHighestClass(maxClass);
  }, [classes, userData]);

  return (
    <div
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      className="flex py-[12px] px-[16px] justify-between items-center hover:bg-sky-100 space-x-3 w-full rounded-sm flex-space-between ">
      <div>
        <p className="text-gray-900 font-semibold">{userData.firstName} {userData.lastName}</p>
        <p className="flex text-gray-500 text-sm">{userData.email}</p>
        <p className="flex text-gray-500 text-sm"></p> {/* TODO: add phone */}
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
      <div>
        {isHovering && user.privilege === "admin" &&
          <LuPencil className="text-lg text-right" />
        }
      </div>
    </div>

  );
};

export default UserItem;