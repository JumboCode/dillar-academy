import { useState, useEffect } from 'react';
import { getUsers } from '../api/user-wrapper';

const Classes = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      //Fetching data
      const userData = await getUsers()
      setData(userData)
    }
    fetchData();
  }, []);


  return (
    <div>
      <h1>Browse Classes</h1>

    </div>
  );
}

export default Classes