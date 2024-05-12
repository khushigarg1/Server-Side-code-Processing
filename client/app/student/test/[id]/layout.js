"use client";
import PageNav from "@/components/StudentpageNav";
import { AuthProvider, ProtectRoute } from "@/contexts/student-auth";

export default function RootLayout({ children, params }) {
  console.log("layout prams: ", children, params);
  return (
    <AuthProvider>
      <PageNav params={params}>
        <ProtectRoute params={params}>{children}</ProtectRoute>
      </PageNav>
    </AuthProvider>
  );
}
