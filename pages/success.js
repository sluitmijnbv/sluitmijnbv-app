import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      setLoading(false);
    }
  }, [session_id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Even geduld...</h1>
        <p>We controleren je betaling...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ color: '#2458A1', fontSize: '32px', marginBottom: '20px' }}>Gefeliciteerd!</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>
        Jouw BV-opheffingsdocumenten zijn succesvol gegenereerd.<br />
        Download ze direct hieronder:
      </p>
      <a
        href={`/api/download-pdf?session_id=${session_id}`}
        style={{
          display: 'inline-block',
          backgroundColor: '#2458A1',
          color: 'white',
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        📄 Download Mijn Documenten
      </a>
    </div>
  );
}
