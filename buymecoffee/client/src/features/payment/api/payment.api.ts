import { baseApi } from "../../../app/api/baseApi";
import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  PaymentStatusResponse,
} from "../types/payment.types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentOrder: builder.mutation<
      CreatePaymentOrderResponse,
      CreatePaymentOrderRequest
    >({
      query: (supportDetails) => ({
        url: "payment/create-order",
        method: "POST",
        body: supportDetails,
      }),
    }),
    getPaymentStatus: builder.query<PaymentStatusResponse, string>({
      query: (orderId) => ({
        url: `payment/status/${encodeURIComponent(orderId)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePaymentOrderMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
} = paymentApi;