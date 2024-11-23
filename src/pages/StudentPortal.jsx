import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const StudentPortal = () => {
    const [location] = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const user = {
          firstName: params.get('firstName'),
          lastName: params.get('lastName'),
          username: params.get('username')
        };
        setUser(user);
      }, [location]);

    return (
        <div>
            <h1>Student: {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</h1>
        </div>
    );
};

export default StudentPortal