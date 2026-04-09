import axios from "axios";
export async function sendMail({ to, subject, htmlContent }) {
  if (!process.env.BREVO_API_KEY) {
    console.warn("No Brevo API key set. Simulating email:");
    return true;
  }
  const payload = {
    sender: { name: "Parcel Logistics", email: "noreply@parcel.local" },
    to: [{ email: to }],
    subject,
    htmlContent
  };
  try {
    const res = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}
export async function sendWelcomeEmail(email, name) {
  return sendMail({
    to: email,
    subject: "Welcome to Parcel Logistics",
    htmlContent: `<h2>Hello ${name},</h2><p>Welcome to Parcel Logistics! Your application to become a partner has been received.</p>`
  });
}
export async function sendOtpEmail(email, trackingId, otp) {
  return sendMail({
    to: email,
    subject: `Your OTP for Parcel Tracking #${trackingId}`,
    htmlContent: `<h2>Package Out for Delivery</h2><p>Your package is out for delivery. Please provide this OTP to the rider: <strong>${otp}</strong>.</p>`
  });
}
export async function sendMerchantNotification(email, message) {
   return sendMail({
    to: email,
    subject: `Important Update from Parcel`,
    htmlContent: `<h2>Account Notification</h2><p>${message}</p>`
  });
}

export async function sendResetPasswordEmail(email, name, resetUrl) {
  return sendMail({
    to: email,
    subject: "Reset Your Parcel Password",
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #475569; line-height: 1.6;">Hello ${name},</p>
        <p style="color: #475569; line-height: 1.6;">We received a request to reset your password. Click the button below to proceed. This link will expire in 1 hour.</p>
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  });
}

