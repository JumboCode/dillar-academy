    import { useState, useEffect } from 'react';
    import { getUsers } from '../api/user-wrapper';
    import axios from 'axios';

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
               <div>
                    {data ? (
                    <h1>user: {data.email}</h1>
                    ) : (
                    <p>Loading...</p> // Show a loading state
                    ) }
                </div>
            </div>
        );
    }

    export default StudentPortal;
