import apiClient from "./api";
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentDetails,
  OrderData,
} from "../types/payment";

class PaymentService {
  /**
   * Tạo link thanh toán PayOS
   */
  async createPayment(
    paymentData: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    try {
      const response = await apiClient.post("/payments", paymentData);
      return response.data;
    } catch (error: unknown) {
      // Enhanced error handling
      const axiosError = error as {
        response?: {
          data?: { message?: string };
          status?: number;
          statusText?: string;
        };
        message?: string;
        request?: unknown;
      };

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Không thể tạo link thanh toán. Vui lòng thử lại.";

      throw new Error(errorMessage);
    }
  }

  /**
   * Lấy thông tin chi tiết thanh toán
   */
  async getPaymentDetails(paymentId: string): Promise<PaymentDetails> {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Không thể lấy thông tin thanh toán.";

      throw new Error(errorMessage);
    }
  }

  /**
   * Xử lý dữ liệu từ giỏ hàng để tạo payment request
   */
  preparePaymentData(
    orderData: OrderData,
    orderId: string
  ): CreatePaymentRequest {
    // Force full payment (subtotal + deposit)
    const amount = orderData.subtotal + orderData.deposit;

    return {
      userId: orderData.userId,
      orderId: orderId,
      amount: amount,
      paymentMethod: orderData.paymentMethod,
      paymentType: "final", // Force full payment
      paidAt: new Date().toISOString(),
    };
  }

  /**
   * Tạo orderId unique (shorter for PayOS compatibility)
   */
  generateOrderId(): string {
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const random = Math.random().toString(36).substring(2, 6); // 4 chars
    return `ORD_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Redirect user to PayOS URL
   */
  redirectToPayOS(payosUrl: string): void {
    if (typeof window !== "undefined") {
      window.location.href = payosUrl;
    }
  }

  /**
   * Validate payment data before sending
   */
  validatePaymentData(orderData: OrderData): {
    isValid: boolean;
    error?: string;
  } {
    if (!orderData.userId) {
      return { isValid: false, error: "Thông tin người dùng không hợp lệ" };
    }

    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      return { isValid: false, error: "Giỏ hàng trống" };
    }

    if (orderData.total <= 0) {
      return { isValid: false, error: "Số tiền thanh toán không hợp lệ" };
    }

    if (
      !orderData.shippingInfo.fullname ||
      !orderData.shippingInfo.phone ||
      !orderData.shippingInfo.address
    ) {
      return { isValid: false, error: "Thông tin giao hàng chưa đầy đủ" };
    }

    if (!orderData.paymentMethod) {
      return { isValid: false, error: "Vui lòng chọn phương thức thanh toán" };
    }

    // Payment type is forced to 'final', no need to validate

    return { isValid: true };
  }
}

// Export singleton instance
const paymentService = new PaymentService();
export default paymentService;
