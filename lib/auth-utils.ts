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
}

export function validateToken(): boolean {
  try {
    const token = getAccessToken();
    if (!token) return false;

    const decoded = decodeJWT(token);
    if (!decoded) {
      clearAccessToken();
      return false;
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      clearAccessToken();
      return false;
    }

    return true;
  } catch {
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
    throw error;
  }
}

function decodeJWT(token: string | null): JWTPayload | null {
  try {
    // Validate token first
    if (!token || typeof token !== "string" || token.trim() === "") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    if (!payload) {
      return null;
    }

    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(): string | null {
  try {
    const token = getAccessToken();
    if (!token) {
      return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      return null;
    }

    // Try different possible fields for userId
    const userId = decoded.userId || decoded.id || decoded.sub || null;
    return userId;
  } catch {
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
  } catch {
    return true;
  }
}

export function getTokenPayload(): JWTPayload | null {
  try {
    const token = getAccessToken();
    if (!token) return null;

    return decodeJWT(token);
  } catch {
    return null;
  }
}

export function getFullNameFromToken(): string | null {
  try {
    const token = getAccessToken();
    if (!token) {
      return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      return null;
    }

    // Try different possible fields for fullname (prioritize 'fullname' over 'fullName')
    const fullname = decoded.fullname || decoded.fullName || null;
    return fullname;
  } catch {
    return null;
  }
}
