import { transporter } from './transporter';

export const sendAssignmentEmail = async (
  to: string,
  name: string,
  taskTitle: string,
  assignedBy: string,
  status: string,
  spaceId: string
) => {
  const missionLink = `https://iskolar-space.vercel.app/space/${spaceId}`;
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
  let bgColor = '#0b0f1a';
  if (status.toLowerCase() === 'low') bgColor = '#1e5631';
  else if (status.toLowerCase() === 'moderate') bgColor = '#f7b32b';
  else if (status.toLowerCase() === 'high') bgColor = '#c03221';

  await transporter.sendMail({
    from: 'IskolarSpace 🚀 <' + process.env.GMAIL_USER + '>',
    to,
    subject: '🪐 New Task Assigned!',
    html: `
      <div style="background-color:#0b0f1a; color:#ffffff; font-family:'Segoe UI', sans-serif; padding:2rem; border-radius:8px; max-width:600px; margin:auto;">
        <p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
          Hello <strong>${name}!</strong>,
        </p>
        <p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
          You've just been assigned a new task in our galactic workflow system:
        </p>
        <div style="background-color:#1c2232; padding:1rem; border-radius:6px; margin:1rem 0;">
          <p style="font-size:1.1rem; color:#ffd700; text-align:center;"><strong>${taskTitle}</strong></p>
        </div>
        <div style="background-color:${bgColor}; padding:0.5rem; border-radius:4px; display:inline-block; margin-bottom:1rem;">
          <p style="font-size:1rem; line-height:1.6; color:#ffffff !important; margin:0;">
            <strong>Status:</strong> ${status}
          </p>
        </div>
        <p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
          <strong>Assigned by:</strong> ${assignedBy}
        </p>
        <hr style="border:none; border-top:1px solid #2c3e50; margin:2rem 0;">
        <div style="text-align:center;">
          <a href="${missionLink}"" style="display:inline-block; background:#9cc9ff; color:#0b0f1a; padding:0.75rem 1.5rem; border-radius:6px; text-decoration:none; font-weight:bold; margin-top:1rem; text-align:center;">
            🚀 View Mission Details
          </a>
          <p style="font-size:0.8rem; color:#888; text-align:center; margin-top:2rem;">
             • Assigned at ${timestamp}
          </p>
        </div>
      </div>
    `,
  });
};

