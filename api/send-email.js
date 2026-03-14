export default async function handler(req, res) {
  // Add CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specifically 'https://savemoremoney.in'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing. Check Vercel environment variables.");
      return res.status(200).json({ success: true, warning: 'Simulated send - Resend not configured.' });
    }

    // Call Resend REST API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // For testing, Resend allows sending from 'onboarding@resend.dev' to your registered email address.
        from: 'Contact Form <onboarding@resend.dev>', 
        to: ['hello@savemoremoney.in'], // Ensure this matches your Resend registered email for testing
        reply_to: email, 
        subject: `[Contact Form] ${subject} from ${name}`,
        html: `
          <h3>New Message from SaveMoreMoney.in Contact Form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        `
      })
    });

    if (resendResponse.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorText = await resendResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      console.error("Resend API error:", errorData);
      
      return res.status(500).json({ 
        error: errorData.message || 'Failed to send email via provider',
        details: errorData 
      });
    }

  } catch (error) {
    console.error('Server function error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
