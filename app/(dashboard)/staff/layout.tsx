import StaffShell from "@/components/staff/StaffShell";

export default function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <StaffShell>{children}</StaffShell>;
}

// import React from 'react'

// const Layout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
//   return (
//     <div className="flex-1">
//       {children}
//     </div>
//   )
// }

// export default Layout
