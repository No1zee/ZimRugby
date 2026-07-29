import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Club Registrar & Admin Registration | Zimbabwe Rugby Union",
  description: "Official ZRU Club Registrar registration for managing official club rosters and player transfers.",
};

export default function ClubRegistrarOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#001c12] py-16 px-4">
      <OnboardingForm
        actor="club-registrar"
        title="CLUB REGISTRAR REGISTRATION"
        subtitle="Register as an authorized club administrator to manage official club rosters and transfer clearances."
      />
    </div>
  );
}
