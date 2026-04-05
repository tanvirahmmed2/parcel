import axios from "axios";

export async function sendMail({ to, subject, htmlContent }) {
  if (!process.env.BREVO_API_KEY) {
    console.warn("No Brevo API key set. Simulating email:");
    console.log(`To: ${to}\nSubject: ${subject}\n\n${htmlContent}`);
    return true;
  }

  const payload = {
    sender: { name: "Percel Logistics", email: "noreply@percel.local" },
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
    console.log("Email sent successfully: " + JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email, name) {
  return sendMail({
    to: email,
    subject: "Welcome to Percel Logistics",
    htmlContent: `<h2>Hello ${name},</h2><p>Welcome to Percel Logistics! Your application to become a partner has been received.</p>`
  });
}

export async function sendOtpEmail(email, trackingId, otp) {
  return sendMail({
    to: email,
    subject: `Your OTP for Percel Tracking #${trackingId}`,
    htmlContent: `<h2>Package Out for Delivery</h2><p>Your package is out for delivery. Please provide this OTP to the rider: <strong>${otp}</strong>.</p>`
  });
}

export async function sendMerchantNotification(email, message) {
   return sendMail({
    to: email,
    subject: `Important Update from Percel`,
    htmlContent: `<h2>Account Notification</h2><p>${message}</p>`
  });
}
