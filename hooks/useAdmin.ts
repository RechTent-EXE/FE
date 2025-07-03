import { useAuth } from "@/contexts/AuthContext";
import { getRoleFromToken, isAdmin as checkIsAdmin } from "@/lib/auth-utils";

export const useAdmin = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return {
    isAdmin,
    isAuthenticated,
    userRole: user?.role,
    canAccessAdmin: isAuthenticated && isAdmin,
    // Utility functions
    requireAdmin: () => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated");
      }
      if (!isAdmin) {
        throw new Error("Admin access required");
      }
    },
    // Direct token check (useful for server-side or when auth context is not available)
    getTokenRole: getRoleFromToken,
    checkTokenAdmin: checkIsAdmin,
  };
};
