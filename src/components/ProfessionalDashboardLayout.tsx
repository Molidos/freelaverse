import DashboardHeader from "./DashboardHeader";
import ProfessionalSidebar from "./ProfessionalSidebar";

export default function ProfessionalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <DashboardHeader role="professional" />
      <div className="flex">
        <ProfessionalSidebar />
        <div className="flex-1 md:ml-64">
          {children}
        </div>
      </div>
    </div>
  );
}

