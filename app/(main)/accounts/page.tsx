import { ErrorAlert, type Error } from "@/components/ui/error-alert";

import { createClient } from "@/utils/supabase/server";

import { columns, Transaction } from "./columns";
import { DataTable } from "./DataTable";

const getData = async (): Promise<{ data?: Transaction[]; error?: Error }> => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: {
        title: "User not found",
        message: "Please log in to view this page.",
      },
    };
  }

  // get the user's transactions

  return { data: undefined, error: undefined };
};

const Accounts = async () => {
  const transactions = await getData();

  return (
    <div className="container mx-auto py-10">
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
};
export default Accounts;
