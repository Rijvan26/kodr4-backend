import { baseApi } from "../../../app/api/baseApi";
import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  PaymentStatusResponse,
  VerifyPaymentRequest,
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
    verifyPayment: builder.mutation<
      PaymentStatusResponse,
      VerifyPaymentRequest
    >({
      query: (paymentData) => ({
        url: "payment/verify",
        method: "POST",
        body: paymentData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            paymentApi.util.updateQueryData(
              "getPaymentStatus",
              arg.razorpay_order_id,
              () => data,
            ),
          );
        } catch {
          // ignore cache update if query fails
        }
      },
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
  useVerifyPaymentMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
} = paymentApi;
