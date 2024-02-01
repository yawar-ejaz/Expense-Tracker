import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context must be used inside authContext Provider!");
  }
  return context;
}
