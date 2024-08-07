export const runtime = "edge";
import { NextResponse } from "next/server";
const stripe = require("stripe")(
  "sk_test_51PgrSiRslotwcTtqgXYpTw3izpN15A3nyLXEdxcrBnu6oBKz2WqkuMQ0Nhi6YJB7G7vLqSGPrbqA67WqHuqubqMm00ffIHZmYZ"
);
import { createClient } from "../../../utils/supabase/client";

export async function POST(request) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  const { price, userCred } = await request.json();
  const userId = userCred;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: price.title,
            },
            unit_amount: price.price * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_URL}success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}cancel`,
    });
  } catch (e) {
    console.log({ error: e.message });
  }

  const planData = {
    id: session.id,
    name: price.title,
    price: price,
  };
  console.log("planData", planData);
  const { data: paymentData, error: paymentError } = await supabase
  .from("payments")
  .upsert(
      [{ user_id: userId, plan_data: planData }],
      { onConflict: ['user_id'] }
  );

  if (paymentError) {
    console.error("Error inserting data:", paymentError);
  } else {
  }

  return NextResponse.json(session);
}
