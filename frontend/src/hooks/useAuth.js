/** useAuth.js
 * @author Anish
 * @description This is the Auth Hook
 * @date 2/12/2025
 * @returns auth context
 */


import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx; 
}
