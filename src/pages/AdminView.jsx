import { useEffect, useState } from "react";

const AdminView = () => {
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

export default AdminView;
