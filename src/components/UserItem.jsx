import { useState, useEffect } from "react";
import { IoPencilSharp } from "react-icons/io5";
import { useAuth } from '@clerk/clerk-react';
import { Link } from "wouter"


const UserItem = ({ userData, classes }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [matchingClass, setMatchingClass] = useState();

  useEffect(() => {
    // Find the matching class for the current user
    setMatchingClass(classes.find((cls) => 
      userData.enrolledClasses.length > 0 &&
      userData.enrolledClasses[0] === cls._id
    )) 
    setIsLoaded(true);
  }, [matchingClass]);
  

  if(!isLoaded) return;

  return (
    <div
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      
                   className="flex py-[12px] px-[16px] justify-between inline-flex items-center hover:bg-sky-100 space-x-3 w-full rounded-s mt-3 mb-3 flex-space-between ">
              {/* <div className= "hover:bg-sky-100"> */}
              
              <div>
                <p className="text-gray-900 font-semibold">{userData.firstName} {userData.lastName}</p>
                <p className="flex inline-flex text-gray-500 text-sm">
                {userData.email}
                </p>
                <p className="text-gray-500 text-sm">
                  {(matchingClass) ? (matchingClass.ageGroup === "all" ? 'All Ages' : `${matchingClass.ageGroup.charAt(0).toUpperCase() + matchingClass.ageGroup.slice(1)}'s Class`) : "No Enrollment"}
                </p>

              </div>
              <div className="">
                
                {isHovering && 
                <Link href={`/admin/students/${encodeURIComponent(userData._id)}`}><IoPencilSharp size={16.81} className=" text-right"/></Link>
                }
              </div>
            </div>

  );
};

export default UserItem;