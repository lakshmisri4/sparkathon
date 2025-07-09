import fs from "fs";
import path from "path";

export async function POST(req) {
  const body = await req.json();
  const { email, otp } = body;

  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  const user = users.find(u => u.email === email);

  if (!user) {
    return Response.json({ success: false, message: "User not found" });
  }

  if (Date.now() > user.otpExpiresAt) {
    return Response.json({ success: false, message: "OTP expired" });
  }

  if (user.otp !== otp) {
    return Response.json({ success: false, message: "Invalid OTP" });
  }

  // Clear OTP after successful verification
  user.otp = null;
  user.otpExpiresAt = null;
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return Response.json({ success: true, message: "OTP verified!" });
}
