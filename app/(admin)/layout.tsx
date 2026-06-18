import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Mini QR Ordering System",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="min-h-screen">{children}</section>;
}
