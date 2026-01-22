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
    const sigLines = [
      '<br><br>Best regards,',
      senderProfile.name,
      senderProfile.company,
      senderProfile.whatsapp ? `WhatsApp: ${senderProfile.whatsapp}` : '',
      senderProfile.portfolioLink ? `Website: <a href="${senderProfile.portfolioLink}">${senderProfile.portfolioLink}</a>` : ''
    ].filter(Boolean).join('<br>');

    body = body + sigLines;
  }

  // Only append opt-out if not already present
  if (!body.toLowerCase().includes('reply stop')) {
    const optOut = '<br><br><span style="font-size: 12px; color: #888;">Reply STOP to opt out.</span>';
    body = body + optOut;
  }

  return { subject, body };
};
