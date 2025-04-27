import { generatedPDFs } from './webhook';

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id || !generatedPDFs[session_id]) {
    return res.status(404).send('Geen documenten gevonden voor deze sessie.');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=sluitmijnbv-documenten.pdf');
  res.status(200).send(Buffer.from(generatedPDFs[session_id]));
}
