import React from "react";

// save this file maybe I might need it for context?


export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div>
      {children}
    </div>
  );
}
