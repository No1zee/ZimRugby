import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Coach Onboarding & Portal Registration | Zimbabwe Rugby Union",
  description: "Official ZRU Coaching Staff registration for accredited club and national squad coaches.",
};

export default function CoachOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#001c12] py-16 px-4">
      <OnboardingForm
        actor="coach"
        title="COACH PORTAL REGISTRATION"
        subtitle="Register as an accredited ZRU coach to manage squad rosters, player stats, and tactical filings."
      />
    </div>
  );
}
