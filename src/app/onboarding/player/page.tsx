import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Player Onboarding & Portal Registration | Zimbabwe Rugby Union",
  description: "Official ZRU Player Portal registration for provincial and national squad eligibility under CDPA 2021 rules.",
};

export default function PlayerOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#001c12] py-16 px-4">
      <OnboardingForm
        actor="player"
        title="PLAYER PORTAL REGISTRATION"
        subtitle="Register your player profile for club, provincial, and national team selection eligibility."
      />
    </div>
  );
}
