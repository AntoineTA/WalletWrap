import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";

const Budget = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      Logged as {data.user.email}
      <LogoutButton />
    </div>
  );
};
export default Budget;
