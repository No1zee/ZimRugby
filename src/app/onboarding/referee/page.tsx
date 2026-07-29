import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Referee Certification & Registration | Zimbabwe Rugby Union",
  description: "Official ZRU Referees Society registration for certified match officials and regional appointments.",
};

export default function RefereeOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#001c12] py-16 px-4">
      <OnboardingForm
        actor="referee"
        title="REFEREE PORTAL REGISTRATION"
        subtitle="Register with the ZRU Referees Society for match appointments, fitness evaluations, and law updates."
      />
    </div>
  );
}
