import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Official Portal Registration & Account Creation | Zimbabwe Rugby Union",
  description: "Create your ZRU portal credentials and complete onboarding registration under CDPA 2021 compliance.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#001c12] py-16 px-4">
      <SignupForm />
    </div>
  );
}
