export const runtime = "edge";
import { NextResponse } from "next/server";
const stripe = require("stripe")(
  "sk_test_51PgrSiRslotwcTtqgXYpTw3izpN15A3nyLXEdxcrBnu6oBKz2WqkuMQ0Nhi6YJB7G7vLqSGPrbqA67WqHuqubqMm00ffIHZmYZ"
);
import user from "../../lib/user.js";
import { createClient } from "../../../utils/supabase/client";
export async function POST(request) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  const userId = data?.user?.id;
  const price = await request.json();

  console.log("user creds", user);

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

      // success_url: `${process.env.NEXT_PUBLIC_URL}success`,
      // cancel_url: `${process.env.NEXT_PUBLIC_URL}cancel`,
      success_url: `${process.env.NEXT_PUBLIC_URL}success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}cancel`,

      // success_url: `${process.env.CLIENT_URL}/success.html`,
      // cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });

    //   const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    //     user_metadata: {
    //         ...paymentPlanDetails
    //     }
    // });
  } catch (e) {
    console.log({ error: e.message });
  }

  const planData = {
    id: session.id,
    name: price.title,
    price: price,
  };

  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .insert([{ user_id: userId, plan_data: planData }]);

  if (paymentError) {
    console.error("Error inserting data:", paymentError);
  } else {
    console.log("Data inserted successfully:", paymentData);
  }

  return NextResponse.json(session);
}
