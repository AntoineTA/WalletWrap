"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }
  if (!error) {
    revalidatePath("/", "layout");
    redirect("/");
  }
};
export default logout;
