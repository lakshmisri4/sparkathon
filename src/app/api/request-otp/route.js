import fs from "fs";
import path from "path";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  // Load users
  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  // Find user
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return Response.json({ success: false, message: "Invalid email or password" });
  }

  // Generate OTP
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

  // Save back to file
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  console.log(`Generated OTP for ${email}: ${otp}`);

  return Response.json({ success: true, message: "OTP sent (printed in console for prototype)" });
}
