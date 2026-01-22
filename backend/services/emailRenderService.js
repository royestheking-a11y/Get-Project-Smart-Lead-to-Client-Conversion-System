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
  if (!body.includes('Best regards')) {
    const sigLines = [
      '\n\nBest regards,',
      senderProfile.name,
      senderProfile.company,
      senderProfile.whatsapp ? `WhatsApp: ${senderProfile.whatsapp}` : '',
      senderProfile.portfolioLink ? `Website: ${senderProfile.portfolioLink}` : ''
    ].filter(Boolean).join('\n'); // remove empty lines

    body = body + sigLines;
  }

  // Only append opt-out if not already present
  if (!body.toLowerCase().includes('reply stop')) {
    const optOut = '\n\nReply STOP to opt out.';
    body = body + optOut;
  }

  return { subject, body };
};
