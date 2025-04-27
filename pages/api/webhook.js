import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

let generatedPDFs = {};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    const buf = await buffer(req);

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { bvName, kvkNumber, address, directorName, closureDate } = session.metadata;

      try {
        const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const { width, height } = page.getSize();

        page.drawText('SluitmijnBV.nl', { x: 50, y: height - 50, size: 18, font, color: rgb(0.14, 0.35, 0.63) });
        page.drawText('ONTBINDINGSBESLUIT', { x: 50, y: height - 100, size: 16, font, color: rgb(0, 0, 0) });

        const content = `Ondergetekende,\\n${directorName}, handelend als enig bestuurder van:\\n\\n${bvName}, gevestigd te ${address},\\nKvK-nummer: ${kvkNumber},\\n\\nBesluit:\\n1. De vennootschap wordt ontbonden per ${closureDate}.\\n2. Het vermogen is vereffend conform artikel 2:19 BW.`;

        page.drawText(content, {
          x: 50,
          y: height - 140,
          size: 12,
          font,
          color: rgb(0, 0, 0),
          maxWidth: 500,
          lineHeight: 20,
        });

        const page2 = pdfDoc.addPage([595.28, 841.89]);
        page2.drawText('SluitmijnBV.nl', { x: 50, y: height - 50, size: 18, font, color: rgb(0.14, 0.35, 0.63) });
        page2.drawText('Instructies voor opheffing van jouw BV', { x: 50, y: height - 100, size: 16, font, color: rgb(0, 0, 0) });

        const instructions = `Gefeliciteerd!\\n\\nVolg deze stappen:\\n\\n1. Print de documenten uit.\\n2. Onderteken beide documenten.\\n3. Stuur Formulier 17a naar de KvK.\\n4. Bewaar kopieën voor je administratie.\\n5. Je ontvangt bevestiging van de KvK.`;

        page2.drawText(instructions, {
          x: 50,
          y: height - 140,
          size: 12,
          font,
          color: rgb(0, 0, 0),
          maxWidth: 500,
          lineHeight: 20,
        });

        const pdfBytes = await pdfDoc.save();

        generatedPDFs[session.id] = pdfBytes;
        console.log('Documenten succesvol gegenereerd voor:', bvName);
      } catch (error) {
        console.error('PDF generatiefout:', error);
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export { generatedPDFs };
