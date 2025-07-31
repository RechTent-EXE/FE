import api from "@/lib/api";

export interface ReturnRequestData {
  photos: string[];
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}

export interface ReturnRequest {
  _id: string;
  orderId: string;
  userId: string;
  cartId: string;
  total: number;
  depositAmount: number;
  status: string;
  createdAt: string;
  __v: number;
  returnRequest: {
    photos: string[];
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
    submittedAt: string;
    verified: boolean;
    isHidden: boolean;
  };
}

// Helper function to convert base64 to File
const base64ToFile = (base64String: string, filename: string): File => {
  const base64Data = base64String.split(",")[1]; // Remove data:image/jpeg;base64, prefix
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });
  return new File([blob], filename, { type: "image/jpeg" });
};

export const returnService = {
  // Submit return request for a specific order
  async submitReturnRequest(
    orderId: string,
    data: ReturnRequestData
  ): Promise<void> {
    // Convert base64 strings to File objects for backend
    const formData = new FormData();

    // Convert base64 photos to File objects
    if (data.photos && data.photos.length > 0) {
      for (let i = 0; i < data.photos.length; i++) {
        const base64String = data.photos[i];
        const file = base64ToFile(base64String, `return-photo-${i}.jpg`);
        formData.append("photos", file);
      }
    }

    formData.append("bankName", data.bankName);
    formData.append("bankAccountNumber", data.bankAccountNumber);
    formData.append("bankAccountHolder", data.bankAccountHolder);

    try {
      const response = await api.post(
        `/orders/${orderId}/return-request`,
        formData
      );
      return response.data;
    } catch (error) {
      // Fallback: try with direct fetch if axios fails
      const token = localStorage.getItem("accessToken");
      const directUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/return-request`;

      const fetchResponse = await fetch(directUrl, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!fetchResponse.ok) {
        throw new Error(
          `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
        );
      }

      const result = await fetchResponse.json();
      return result;
    }
  },

  // Get pending return requests (for admin)
  async getPendingReturnRequests(): Promise<ReturnRequest[]> {
    const response = await api.get("/orders/return-requests/pending");
    return response.data;
  },

  // Get return request details by order ID
  async getReturnRequestByOrderId(orderId: string): Promise<ReturnRequest> {
    const response = await api.get(`/orders/${orderId}/return-request`);
    return response.data;
  },

  // Approve return request (for admin)
  async approveReturnRequest(orderId: string): Promise<void> {
    const response = await api.post(`/orders/${orderId}/verify-return`);
    return response.data;
  },

  // Reject return request (for admin)
  async rejectReturnRequest(orderId: string, reason?: string): Promise<void> {
    const response = await api.patch(`/orders/${orderId}/refuse-return`, {
      reason,
    });
    return response.data;
  },

  // Get approved return requests (for admin)
  async getApprovedReturnRequests(): Promise<ReturnRequest[]> {
    const response = await api.get("/orders/return-requests/approved");
    return response.data;
  },

  // Get rejected return requests (for admin)
  async getRejectedReturnRequests(): Promise<ReturnRequest[]> {
    const response = await api.get("/orders/return-requests/rejected");
    return response.data;
  },
};
