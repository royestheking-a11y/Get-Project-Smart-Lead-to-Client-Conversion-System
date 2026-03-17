export const renderTemplate = (template, lead, senderProfile = {}) => {
  let subject = template.subjectTemplate;
  let body = template.bodyTemplate;

  // Replace variables - support both camelCase and snake_case formats
  const variables = {
    // Lead variables
    '{{firstName}}': lead.firstName || lead.contactName?.split(' ')[0] || 'there',
    '{{first_name}}': lead.firstName || lead.contactName?.split(' ')[0] || 'there',
    '{{companyName}}': lead.companyName || lead.company || 'your company',
    '{{company_name}}': lead.companyName || lead.company || 'your company',
    '{{website}}': lead.website || '',
    '{{location}}': lead.location || '',
    '{{industry}}': lead.industry || '',

    // Sender variables - camelCase (used in new templates)
    '{{senderName}}': senderProfile.name || 'Aurangzeb Sunny',
    '{{senderCompany}}': senderProfile.company || 'RizQara Tech',
    '{{senderPhone}}': senderProfile.whatsapp || '+880 1343-042761',
    '{{senderWebsite}}': senderProfile.portfolioLink || 'https://rizqaratech.vercel.app',

    // Sender variables - snake_case (legacy support)
    '{{sender_name}}': senderProfile.name || 'Aurangzeb Sunny',
    '{{your_name}}': senderProfile.name || 'Aurangzeb Sunny',
    '{{sender_email}}': senderProfile.email || '',
    '{{company}}': senderProfile.company || 'RizQara Tech',
    '{{sender_company}}': senderProfile.company || 'RizQara Tech',
    '{{your_company}}': senderProfile.company || 'RizQara Tech',
    '{{whatsapp}}': senderProfile.whatsapp || '+880 1343-042761',
    '{{portfolio_link}}': senderProfile.portfolioLink || 'https://rizqaratech.vercel.app'
  };

  console.log('📝 Template variables:', JSON.stringify(variables, null, 2));

  // Replace all variables in subject and body
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
    subject = subject.replace(regex, variables[key]);
    body = body.replace(regex, variables[key]);
  });

  // Wrap in a very simple, clean div with standard sans-serif font
  const signatureName = senderProfile.name || 'Aurangzeb Sunny';
  const signatureCompany = senderProfile.company || 'RizQara Tech';
  const whatsapp = senderProfile.whatsapp || '8801343042761';
  const website = senderProfile.portfolioLink || 'www.rizqara.tech';
  const websiteUrl = website.startsWith('http') ? website : `https://${website}`;

  // Build signature lines for TEXT
  let textSignature = `Best,\n${signatureName}`;
  if (signatureCompany && signatureCompany !== signatureName) {
    textSignature += `\n${signatureCompany}`;
  }
  textSignature += `\nWhatsApp: ${whatsapp}`;
  textSignature += `\nWebsite: ${website}\n\nReply STOP to opt out.`;

  // Build signature for HTML
  let htmlSignature = `<br>Best,<br>${signatureName}`;
  if (signatureCompany && signatureCompany !== signatureName) {
    htmlSignature += `<br>${signatureCompany}`;
  }
  htmlSignature += `<br>WhatsApp: ${whatsapp}`;
  htmlSignature += `<br><a href="${websiteUrl}" style="color: #111; text-decoration: underline;">${website}</a>`;
  htmlSignature += `<br><br><span style="font-size: 11px; color: #999;">Reply STOP to opt out.</span>`;

  // CLEANUP: Convert body to text and html
  const textBody = body.trim() + '\n\n' + textSignature;
  
  // HTML Body: convert newlines to <br> for standard compatibility
  const htmlBody = `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #111; line-height: 1.4;">${body.trim().replace(/\n/g, '<br>')}${htmlSignature}</div>`;

  return { subject, html: htmlBody, text: textBody };
};
