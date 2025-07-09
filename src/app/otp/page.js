import { InputOTPForm } from "@/components/otp-form";

export default function otp() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <main className="w-full max-w-sm md:max-w-3xl mx-auto flex items-center justify-center">
                <InputOTPForm />
            </main>
        </div>
    );
}