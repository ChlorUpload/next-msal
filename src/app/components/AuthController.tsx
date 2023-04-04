"use client";

import { authClient } from "@/auth/authClient";

export function AuthController() {
  return (
    <div>
      <button
        onClick={() => {
          authClient.signIn();
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          authClient.signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}
