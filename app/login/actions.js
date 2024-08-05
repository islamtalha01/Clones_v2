"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      data: { full_name: data.email.split("@")[0] },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}`,
    },
  });

  revalidatePath("/", "layout");
  const encodedEmail = encodeURIComponent(data.email);
  redirect(`/verify_email?email=${encodedEmail}`);
}
