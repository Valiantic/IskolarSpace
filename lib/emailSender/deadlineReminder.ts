import { transporter } from './transporter';

export const sendDeadlineReminderEmail = async (
	to: string,
	name: string,
	taskTitle: string,
	deadline: string,
	spaceName: string,
	spaceId: string
) => {
	// Check if deadline is today
	const today = new Date().toISOString().split('T')[0];
	if (deadline !== today) return;

	const spaceLink = `https://iskolar-space.vercel.app/space/${spaceId}`;
	await transporter.sendMail({
		from: 'IskolarSpace 🚀 <' + process.env.GMAIL_USER + '>',
		to,
		subject: `⏰ Task Deadline Reminder: ${taskTitle}`,
		html: `
			<div style="background-color:#0b0f1a; color:#ffffff; font-family:'Segoe UI', sans-serif; padding:2rem; border-radius:8px; max-width:600px; margin:auto;">
				<h2 style="color:#ff6f61; text-align:center;">Deadline Reminder</h2>
				<p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
					Hello <strong>${name}</strong>,
				</p>
				<p style="font-size:1rem; line-height:1.6; color:#ffffff !important;">
					This is a reminder that your task <strong>"${taskTitle}"</strong> in <strong>${spaceName}</strong> is due <span style='color:#ffd700;'>today</span> (<strong>${deadline}</strong>).
				</p>
				<hr style="border:none; border-top:1px solid #2c3e50; margin:2rem 0;">
				<div style="text-align:center;">
					<a href="${spaceLink}" style="display:inline-block; background:#ff6f61; color:#0b0f1a; padding:0.75rem 1.5rem; border-radius:6px; text-decoration:none; font-weight:bold; margin-top:1rem; text-align:center;">
						🔗 View Your Space
					</a>
				</div>
				<p style="font-size:0.8rem; color:#888; text-align:center; margin-top:2rem;">
					 • Sent on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
				</p>
			</div>
		`,
	});
};
