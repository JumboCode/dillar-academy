import { useState, useEffect } from 'react';

const Classes = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async() => {
      //Fetching data
      try {
        const response = await fetch('http://localhost:4000/api/users');
        const jsonData = await response.json() // Converting data to json
        setData(jsonData); // Set data appropriately
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);


  return (
    <div>
      <h1>Browse Classes</h1>
      
      {/* Converts the data to string format to be printed.  */}
      {data ? (<div>{JSON.stringify(data)}</div>):(<p>nothing to print</p>)}

    </div>
  );
}

export default Classes