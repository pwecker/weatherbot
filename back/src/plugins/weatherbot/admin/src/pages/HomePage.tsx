import { useEffect, useState } from 'react';
import { Main, Button } from '@strapi/design-system';
import axios from 'axios';

const HomePage = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await axios.get('/api/weatherbot/status');
        setConnected(res.data);
      } catch(e) {
        setConnected(false);
      }
    }
    checkConnection();
  }, [])

  const handleConnect = () => {
    window.location.href = '/api/weatherbot/auth';
  };

  return (
    <Main>
      { connected === null ? (
        <p>Checking status...</p>
      ) : connected ? (
        <p>X Account Connected ✅</p>
      ) : (
        <Button onClick={handleConnect}>Connect X Account</Button>
      )}
    </Main>
  );
};

export { HomePage };
