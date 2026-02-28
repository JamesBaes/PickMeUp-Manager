import StaffShell from "@/components/staff/StaffShell";

export default function StaffLayout({ children }: Readonly<{ children: any }>) {
  return <StaffShell>{children}</StaffShell>;
}