import "dotenv/config";
import stripe from "../../DataBase/stripe.js";
import { persistPaidCheckoutSession } from "./persistCheckoutOrder.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const webhook = async (req, res) => {
  if (!endpointSecret) {
    return res.status(500).send("Stripe webhook secret is not configured.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      endpointSecret
    );
  } catch {
    return res.status(400).send("Webhook signature verification failed.");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await persistPaidCheckoutSession(event.data.object);
        break;
      default:
        break;
    }

    return res.status(200).send();
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return res.status(500).send("Webhook processing failed.");
  }
};

export default webhook;
