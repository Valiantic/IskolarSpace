import { transporter } from './transporter';

export const sendWelcomeEmail = async (
  to: string,
  name: string,
  spaceName: string,
  spaceId: string,
  invitedBy: string
) => {
  const spaceLink = `https://iskolar-space.vercel.app/space/${spaceId}`;
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
  await transporter.sendMail({
    from: 'IskolarSpace 🚀 <' + process.env.GMAIL_USER + '>',
    to,
    subject: `🪐 Welcome to ${spaceName}!`,
    html: `
      <div style="background-color:#0b0f1a; color:#ffffff; font-family:'Segoe UI', sans-serif; padding:2rem; border-radius:8px; max-width:600px; margin:auto;">
        <h2 style="color:#9cc9ff; text-align:center;">Welcome to <span style='color:#ffd700;'>${spaceName}</span>!</h2>
        <p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
          Hello <strong>${name}!</strong>,
        </p>
        <p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
          You've just joined <strong>${spaceName}</strong> in IskolarSpace. We're excited to have you on board!
        </p>
        <hr style="border:none; border-top:1px solid #2c3e50; margin:2rem 0;">
        <div style="text-align:center;">
          <a href="${spaceLink}" style="display:inline-block; background:#9cc9ff; color:#0b0f1a; padding:0.75rem 1.5rem; border-radius:6px; text-decoration:none; font-weight:bold; margin-top:1rem; text-align:center;">
            🚀 Go to Your Space
          </a>
          <p style="font-size:0.8rem; color:#888; text-align:center; margin-top:2rem;">
             • Joined at ${timestamp}
          </p>
        </div>
      </div>
    `,
  });
};
