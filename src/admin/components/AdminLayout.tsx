
import MinimalAdminLayout from "./MinimalAdminLayout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <MinimalAdminLayout>
      {children}
    </MinimalAdminLayout>
  );
}
