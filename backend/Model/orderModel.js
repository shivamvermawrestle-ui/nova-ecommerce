import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productDetails: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },
    stripeCheckoutSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDetails: {
      paymentId: {
        type: String,
        default: "",
      },
      refundId: {
        type: String,
        default: "",
      },
      payment_method_type: {
        type: Array,
        default: [],
      },
      payment_status: {
        type: String,
        default: "",
      },
    },
    shippingAddress: {
      type: Object,
      default: {},
    },
    shipping_options: {
      type: Array,
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
  },
  {
    timestamps: true,
  }
);

const ordermodel = mongoose.model("order", orderSchema);
export default ordermodel;