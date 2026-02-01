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
