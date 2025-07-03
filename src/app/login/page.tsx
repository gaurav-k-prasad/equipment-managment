"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("divya@example.com");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Sign In 
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 text-center text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-60"
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
            className="inline-block"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
          <span>{loading ? "Redirecting..." : "Continue with Google"}</span>
        </button>
      </div>
    </div>
  );
}
