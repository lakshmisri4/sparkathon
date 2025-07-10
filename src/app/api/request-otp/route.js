import fs from "fs";
import path from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  // Path to your users.json file
  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  // Find user by email
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return Response.json({ success: false, message: "Invalid email or password" });
  }

  // Generate OTP
  const otp = generateOTP();

  // Save OTP and expiry
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  console.log(`OTP for ${email}: ${otp}`);

  try {
    // Send OTP via email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return Response.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message });
  }
}
