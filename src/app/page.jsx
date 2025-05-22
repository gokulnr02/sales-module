"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/dashboard"); // Navigate to Dashboard
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Welcome to the Micro Solutions</h1>
      <button
        onClick={handleNavigate}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
