"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dummy user data (same as in users list)
const dummyUsers = [
  {
    id: "1234",
    name: "Divya Guruvelli",
    email: "divya@example.com",
    role: "USER",
    phone: "8688476424",
    location: "Hyderabad",
    joined: "2024-01-01",
  },
  {
    id: "5678",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    phone: "9999999999",
    location: "Delhi",
    joined: "2023-12-10",
  },
];

export default function UserProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const found = dummyUsers.find((u) => u.id === userId);
    setUser(found);
  }, [userId]);

  if (!user) {
    return (
      <div className="p-10 text-center text-red-600">
        <h1 className="text-2xl font-bold">404 - User Not Found</h1>
        <p>No user exists with ID: <strong>{userId}</strong></p>
        <button
          onClick={() => router.push("/dashboard/users")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to User List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">User Profile</h1>
      <div className="space-y-3 text-gray-800 text-lg">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Location:</strong> {user.location}</p>
        <p><strong>Joined:</strong> {user.joined}</p>
      </div>

      <button
        onClick={() => router.push("/dashboard/users")}
        className="mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        ← Back to User List
      </button>
    </div>
  );
}
