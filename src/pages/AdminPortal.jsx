import { useState, useEffect } from 'react';
import { getUsers, postLogin } from '../api/user-wrapper';

function AdminPortal() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await postLogin();
            setData(userData);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>admin:</h1>
            <div className = "getData">
                <ul>
                    {data ? (
                        data.map(user => (
                            <li key={user.id}>{user.firstName}</li>
                        ))
                    ) : (
                        <p>Loading...</p> // Show a loading state
                    )}
                </ul>
            </div>
        </div>
    );
}

export default AdminPortal;
