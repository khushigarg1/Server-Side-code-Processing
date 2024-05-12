"use client";
import PageNav from "@/components/facultypageNav";
import { AuthProvider, ProtectRoute } from "@/contexts/faculty-auth";

export default function RootLayout({ children }) {
  return (
    // <html lang="en">

    <AuthProvider>
      <PageNav>
        <ProtectRoute>{children}</ProtectRoute>
      </PageNav>
    </AuthProvider>

    // </html>
  );
}
