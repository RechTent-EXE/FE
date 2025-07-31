import api from "../lib/api";
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentDetails,
  OrderData,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentHistory,
  OrderDetail,
} from "../types/payment";

class PaymentService {
  async createPayment(
    paymentData: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    try {
      if (!paymentData.orderId) {
        throw new Error("Mã đơn hàng (orderId) không được cung cấp");
      }

      if (!paymentData.userId) {
        throw new Error("ID người dùng (userId) không được cung cấp");
      }

      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error("Số tiền thanh toán không hợp lệ");
      }

      const response = await api.post("/payments", paymentData);
      return response.data;
    } catch (error: unknown) {
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

  async getPaymentDetails(paymentId: string): Promise<PaymentDetails> {
    try {
      const response = await api.get(`/payments/${paymentId}`);
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

  preparePaymentData(
    orderData: OrderData,
    orderId: string,
    orderTotal?: number // Use order total from backend if provided
  ): CreatePaymentRequest {
    if (!orderId) {
      throw new Error("orderId is required to prepare payment data");
    }

    const amount = orderTotal || orderData.total;

    const paymentData = {
      userId: orderData.userId,
      orderId: orderId,
      amount: amount,
      paymentMethod: orderData.paymentMethod,
      paymentType: "deposit" as const,
      paidAt: new Date().toISOString(),

      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
    };

    return paymentData;
  }

  generateOrderId(): string {
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const random = Math.random().toString(36).substring(2, 6); // 4 chars
    return `ORD_${timestamp}_${random}`.toUpperCase();
  }

  redirectToPayOS(payosUrl: string): void {
    if (typeof window !== "undefined") {
      window.location.href = payosUrl;
    }
  }

  async createOrder(
    orderData: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    try {
      const response = await api.post("/orders/from-cart", orderData);

      // Validate response structure
      if (!response.data) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      // Check if orderId is in the nested order object
      const orderId = response.data.orderId || response.data.order?.orderId;

      if (!orderId) {
        throw new Error("Server không trả về mã đơn hàng (orderId)");
      }

      // Return normalized structure with orderId at top level
      return {
        ...response.data,
        orderId: orderId,
        // If response has nested order, flatten some important fields
        ...(response.data.order && {
          _id: response.data.order._id,
          userId: response.data.order.userId,
          cartId: response.data.order.cartId,
          total: response.data.order.total,
          status: response.data.order.status,
          createdAt: response.data.order.createdAt,
          __v: response.data.order.__v,
        }),
      };
    } catch (error: unknown) {
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
        "Không thể tạo đơn hàng. Vui lòng thử lại.";

      throw new Error(errorMessage);
    }
  }

  async clearCartItems(cartId: string): Promise<void> {
    try {
      await api.delete(`/cart-items/DeleteAllByCart/${cartId}`);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Không thể xóa giỏ hàng.";

      throw new Error(errorMessage);
    }
  }

  async confirmPayment(
    orderCode: string
  ): Promise<{ success: boolean; message?: string; data?: unknown }> {
    try {
      const response = await api.get(`/payments/confirm/${orderCode}`);
      return response.data;
    } catch (error: unknown) {
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
        "Không thể xác nhận trạng thái thanh toán.";

      throw new Error(errorMessage);
    }
  }

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

    return { isValid: true };
  }

  // Get payment history for user profile
  async getUserPaymentHistory(userId: string): Promise<PaymentHistory[]> {
    try {
      const response = await api.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Không thể lấy lịch sử thanh toán.";

      throw new Error(errorMessage);
    }
  }

  // Get order details by orderId
  async getOrderDetails(orderId: string): Promise<OrderDetail[]> {
    try {
      const response = await api.get(`/order-details/by-order/${orderId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Không thể lấy chi tiết đơn hàng.";

      throw new Error(errorMessage);
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
