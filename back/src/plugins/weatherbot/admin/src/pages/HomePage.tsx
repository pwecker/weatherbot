import { useEffect, useState } from 'react';
import { Main, Button } from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';
const { get } = getFetchClient();

const HomePage = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await get('/weatherbot/status');
        const { connected } = res.data;
        setConnected(connected);
      } catch(e) {
        setConnected(false);
      }
    }
    checkConnection();
  }, [])

  const handleConnect = async() => {
    const response = await get('/weatherbot/auth');
    const { redirect } = response.data;
    window.location.href = redirect;
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
