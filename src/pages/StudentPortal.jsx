    import { useState, useEffect } from 'react';
    import { getUsers } from '../api/user-wrapper';

    function StudentPortal() {
        const [data, setData] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
                const userData = await getUsers();
                setData(userData);
            }
            fetchData();
        }, []);

        return (
            <div>
                <h1>Student:</h1>
                <ul>
                    {data ? (
                        data.map(user => (
                            <li key={user.id}>{user.username}</li>
                        ))
                    ) : (
                        <p>Loading...</p> // Show a loading state
                    )}
                </ul>
            </div>
        );
    }

    export default StudentPortal;
