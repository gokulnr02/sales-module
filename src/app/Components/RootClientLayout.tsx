"use client"; // Keep this because we're using useEffect & useState

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (!user && pathname !== "/login") {
      router.replace("/login");
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
