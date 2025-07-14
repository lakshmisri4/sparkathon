import fs from "fs";
import path from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  const user = users.find((u) => u.email === email);

  if (!user) {
    return Response.json({ success: false, message: "User not found." });
  }

  if (user.password !== password) {
    return Response.json({ success: false, message: "Incorrect password." });
  }

  // ✅ Generate OTP
  const otp = generateOTP();

  // ✅ Save OTP + expiry (5 min)
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000;

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  try {
    const data = await resend.emails.send({
      from: "otp@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return Response.json({ success: true, message: "OTP sent.", data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to send email.", error: error.message });
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
