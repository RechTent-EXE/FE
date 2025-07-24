// Payment related types for PayOS integration

export interface CreatePaymentRequest {
  userId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paymentType: "deposit" | "final";
  paidAt: string; // ISO string format for backend
  returnUrl?: string; // Success callback URL
  cancelUrl?: string; // Cancel callback URL
}

export interface PaymentItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  startDate: string;
  endDate: string;
}

export interface CreatePaymentResponse {
  id: string;
  payosUrl: string;
  orderId: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
}

export interface PaymentDetails {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  payosUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  items?: PaymentItem[];
}

export interface PaymentHookData {
  id: string;
  status: string;
  amount: number;
  transactionId?: string;
  paidAt?: string;
}

// Order related types
export interface OrderData {
  userId: string;
  cartItems: OrderItem[];
  subtotal: number;
  discount: number;
  deposit: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  paymentType: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  singleDayPrice: number;
  actualPrice: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositAmount: number;
}

export interface ShippingInfo {
  fullname: string;
  phone: string;
  address: string;
  notes?: string;
}

// Payment form data
export interface PaymentFormData {
  paymentMethod: "credit_card" | "bank_transfer" | "e_wallet";
  paymentType: "deposit" | "final";
  agreeToTerms: boolean;
}

// Order creation types
export interface CreateOrderRequest {
  userId: string;
  cartId: string;
}

export interface CreateOrderResponse {
  _id: string;
  orderId: string;
  userId: string;
  cartId: string;
  total: number;
  status: string;
  createdAt: string;
  __v: number;
  // Additional fields from backend response
  order?: {
    _id: string;
    orderId: string;
    userId: string;
    cartId: string;
    total: number;
    status: string;
    createdAt: string;
    __v: number;
  };
  orderDetails?: Array<{
    productId: string;
    quantity: number;
    price: number;
    startDate: string;
    endDate: string;
  }>;
  totalAmount?: number;
}
