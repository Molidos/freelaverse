import DashboardHeader from "./DashboardHeader";
import ClientSidebar from "./ClientSidebar";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <DashboardHeader role="client" />
      <div className="flex">
        <ClientSidebar />
        <div className="flex-1 md:ml-64">
          {children}
        </div>
      </div>
    </div>
  );
}

