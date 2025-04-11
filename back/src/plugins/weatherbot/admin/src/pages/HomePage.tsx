import { useEffect, useState, ChangeEvent } from 'react';
import { Main, Button } from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';
const { get, post } = getFetchClient();

const HomePage = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setUploadResult(null);
  }

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('cities', file);

    try {
      setUploading(true);
      setUploadResult(null);
      const response = await post('/weatherbot/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResult(response.data === true ? '✅ Locations created.' : '⚠️ Unexpected response');
    } catch (e: any) {
      console.log(`Error: ${e}`)
      setUploadResult('❌ Upload failed')
    } finally {
      setUploading(false);
    }
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

      <br />

      <input type="file" accept=".txt,.csv" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading} loading={uploading}>
        {uploading ? 'Uploading...' : 'Create Locations'}
      </Button>
      {uploadResult && (<p>{uploadResult}</p>)}

    </Main>
  );
};

export { HomePage };
