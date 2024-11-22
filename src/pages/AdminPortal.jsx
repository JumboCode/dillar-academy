import { useState, useEffect } from 'react';
import { getUsers, postLogin } from '../api/user-wrapper';

function AdminPortal() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await postLogin('adminUser', 'adminPass');
            setData(userData);
        };
        fetchData();
    }, []);

    return (
        <div>
            {data ? (
                <h1>{data.firstName}</h1>
            ) : (
                <p>Loading...</p> // Show a loading state
            ) }
        </div>
    );
}

export default AdminPortal;
