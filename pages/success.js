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
    return <p>Even wachten... betaling wordt gecontroleerd...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Gefeliciteerd!</h1>
      <p>Je documenten zijn klaar om te downloaden:</p>
      <a href={`/api/download-pdf?session_id=${session_id}`}>
        <button style={{ padding: '10px 20px', backgroundColor: '#2458A1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Download je documenten
        </button>
      </a>
    </div>
  );
}
