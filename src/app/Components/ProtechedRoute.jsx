"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("userId");

    if (!user) {
      // Redirect to login if no user is found
      router.replace("/login");
    }

    setLoading(false);
  }, [router]);

  if (loading) return <div>
    <div className="flex justify-center items-center h-screen ParentBg">
      <Image src="/images/BrandLogo.jpg"
        alt="Brand Logo"
        width={170}
        height={0}
        className="w-[120px] sm:w-[140px] md:w-[170px]" />
    </div>
  </div>;
  return <>{children}</>;
}
