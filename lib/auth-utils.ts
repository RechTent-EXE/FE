export interface JWTPayload {
  userId?: string;
  id?: string;
  sub?: string;
  email?: string;
  fullname?: string;
  fullName?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  console.log("Access token cleared from localStorage");
}

export function validateToken(): boolean {
  try {
    const token = getAccessToken();
    if (!token) return false;

    const decoded = decodeJWT(token);
    if (!decoded) {
      console.warn("Invalid token detected, clearing from localStorage");
      clearAccessToken();
      return false;
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      console.warn("Token expired, clearing from localStorage");
      clearAccessToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    clearAccessToken();
    return false;
  }
}

function base64UrlDecode(str: string): string {
  try {
    if (!str || typeof str !== "string") {
      throw new Error("Invalid base64 string");
    }

    // Add padding if necessary
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    return atob(str);
  } catch (error) {
    console.error("Error in base64UrlDecode:", error);
    throw error;
  }
}

function decodeJWT(token: string | null): JWTPayload | null {
  try {
    // Validate token first
    if (!token || typeof token !== "string" || token.trim() === "") {
      console.warn("Invalid or empty token provided");
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid JWT format - expected 3 parts, got:", parts.length);
      return null;
    }

    const payload = parts[1];
    if (!payload) {
      console.warn("Invalid JWT - missing payload");
      return null;
    }

    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function getUserIdFromToken(): string | null {
  try {
    const token = getAccessToken();
    if (!token) {
      console.log("No access token found in localStorage");
      return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      console.warn("Failed to decode JWT token");
      return null;
    }

    // Try different possible fields for userId
    const userId = decoded.userId || decoded.id || decoded.sub || null;
    console.log("Debug - Extracted userId from token:", userId);
    return userId;
  } catch (error) {
    console.error("Error getting userId from token:", error);
    return null;
  }
}

export function isTokenExpired(): boolean {
  try {
    const token = getAccessToken();
    if (!token) return true;

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
}

export function getTokenPayload(): JWTPayload | null {
  try {
    const token = getAccessToken();
    if (!token) return null;

    return decodeJWT(token);
  } catch (error) {
    console.error("Error decoding token payload:", error);
    return null;
  }
}

export function getFullNameFromToken(): string | null {
  try {
    const token = getAccessToken();
    if (!token) {
      console.log("No access token found for fullname extraction");
      return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      console.warn("Failed to decode JWT token for fullname");
      return null;
    }

    // Try different possible fields for fullname (prioritize 'fullname' over 'fullName')
    const fullname = decoded.fullname || decoded.fullName || null;
    console.log("Debug - Extracted fullname from token:", fullname);
    return fullname;
  } catch (error) {
    console.error("Error getting fullname from token:", error);
    return null;
  }
}
