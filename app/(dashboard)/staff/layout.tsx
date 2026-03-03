import StaffShell from "@/components/staff/StaffShell";

export default function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <StaffShell>{children}</StaffShell>;
}