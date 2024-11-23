import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const AdminPortal = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [, setLocation] = useLocation();
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
            <h1>Admin: {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</h1>
        </div>
    );
};

export default AdminPortal