import React, { useEffect, useState } from 'react';
import api from './api/axios';  // Adjust path if needed

function ExampleComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/your-endpoint/')  // Replace with a real endpoint like /api/portfolio/
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}

export default ExampleComponent;