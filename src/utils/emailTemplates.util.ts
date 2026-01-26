import config from '../config/env.config.js';

const LOGO_URL = 'https://promptpal-nine.vercel.app/assets/logo-full-CJJxhF69.png';

export const getEmailVerificationTemplate = (verificationURL: string, firstName?: string) => {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - PromptPal</title>
  <style>
    @media only screen and (max-width: 600px) {
      .mobile-padding {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .mobile-padding-content {
        padding: 0 12px 30px !important;
      }
      .mobile-padding-header {
        padding: 30px 12px 20px !important;
      }
      .mobile-padding-footer {
        padding: 24px 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #030303; color: #ffffff;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #030303;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden;">
          <!-- Header with gradient border -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #06b6d4 0%, #6366f1 50%, #f43f5e 100%);"></td>
          </tr>
          
          <!-- Logo and Header -->
          <tr>
            <td align="center" class="mobile-padding-header" style="padding: 40px 20px 30px;">
              <img src="${LOGO_URL}" alt="PromptPal Logo" style="max-width: 200px; height: auto; display: block;" />
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="mobile-padding-content" style="padding: 0 20px 40px;">
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                Welcome to PromptPal! 🎉
              </h1>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">
                ${greeting}
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">
                Thank you for joining PromptPal! We're excited to have you on board. To get started and access all features, please verify your email address by clicking the button below.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <a href="${verificationURL}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;">
                      Verify Your Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <div style="background-color: rgba(99, 102, 241, 0.1); border-left: 3px solid #6366f1; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); line-height: 1.5;">
                  <strong style="color: #6366f1;">⏰ Important:</strong> This verification link will expire in <strong>24 hours</strong>. If you didn't create an account with PromptPal, please ignore this email.
                </p>
              </div>
              
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.6);">
                Once verified, you'll be able to:
              </p>
              <ul style="margin: 12px 0 24px; padding-left: 24px; font-size: 14px; line-height: 1.8; color: rgba(255, 255, 255, 0.8);">
                <li>Access all premium features</li>
                <li>Save and organize your prompts</li>
                <li>Join the PromptPal community</li>
                <li>Share and monetize your prompts</li>
              </ul>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="mobile-padding-footer" style="padding: 32px 20px; background-color: rgba(255, 255, 255, 0.02); border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 12px; font-size: 14px; color: rgba(255, 255, 255, 0.6); text-align: center;">
                Need help? Contact us at <a href="mailto:support@promptpal.com" style="color: #6366f1; text-decoration: none;">support@promptpal.com</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.4); text-align: center;">
                © ${new Date().getFullYear()} PromptPal. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

export const getEmailVerificationText = (verificationURL: string, firstName?: string) => {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  
  return `
${greeting}

Welcome to PromptPal! 🎉

Thank you for joining PromptPal! We're excited to have you on board. To get started and access all features, please verify your email address by clicking the link below:

${verificationURL}

⏰ Important: This verification link will expire in 24 hours.

Once verified, you'll be able to:
- Access all premium features
- Save and organize your prompts
- Join the PromptPal community
- Share and monetize your prompts

If you didn't create an account with PromptPal, please ignore this email.

Need help? Contact us at support@promptpal.com

© ${new Date().getFullYear()} PromptPal. All rights reserved.
  `.trim();
};

