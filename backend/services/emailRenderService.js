export const renderTemplate = (template, lead, senderProfile = {}) => {
  let subject = template.subjectTemplate;
  let body = template.bodyTemplate;

  // Replace variables
  const variables = {
    '{{company_name}}': lead.companyName || 'there',
    '{{website}}': lead.website || '',
    '{{location}}': lead.location || '',
    '{{industry}}': lead.industry || '',
    '{{sender_name}}': senderProfile.name || '',
    '{{your_name}}': senderProfile.name || '', // Alias for sender_name
    '{{sender_email}}': senderProfile.email || '',
    '{{company}}': senderProfile.company || '',
    '{{sender_company}}': senderProfile.company || '',
    '{{your_company}}': senderProfile.company || '',
    '{{whatsapp}}': senderProfile.whatsapp || '',
    '{{portfolio_link}}': senderProfile.portfolioLink || ''
  };

  // Replace all variables in subject and body
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
    subject = subject.replace(regex, variables[key]);
    body = body.replace(regex, variables[key]);
  });

  // Append signature and opt-out line
  // Append signature only if no closing is detected
  // We check for common closing phrases (case-insensitive) to avoid duplicates
  const hasClosing = /(regards|sincerely|cheers|best,|faithfully|yours|thanks,)/i.test(body);

  if (!hasClosing) {
    // Use exact signature format requested by user
    const signature = `<br><br><p>
Best regards,<br>
${senderProfile.name || 'Aurangzeb Sunny'}<br>
${senderProfile.company || 'RizQara Tech'}<br>
WhatsApp: <a href="https://api.whatsapp.com/send?phone=${senderProfile.whatsapp || '8801343042761'}">${senderProfile.whatsapp || '+880 1343-042761'}</a><br>
Website: <a href="${senderProfile.portfolioLink || 'https://rizqaratech.vercel.app/'}">${senderProfile.portfolioLink || 'https://rizqaratech.com/'}</a><br><br>
Reply STOP to opt out.
</p>`;

    body = body + signature;
  } else {
    // If body already has a closing, just add the opt-out line separately
    if (!body.toLowerCase().includes('reply stop')) {
      const optOut = '<br><br><span style="font-size: 12px; color: #888;">Reply STOP to opt out.</span>';
      body = body + optOut;
    }
  }

  return { subject, body };
};
