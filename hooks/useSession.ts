import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Error } from "@/components/ErrorAlert";

export const useSession = () => {
  const supabase = createClient();

  const getUserId = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (!session) throw error;
    return session.user.id;
  };

  const getBudgetId = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (!session) throw error;

    const { data: budget } = await supabase
      .from("budgets_view")
      .select("id")
      .eq("user_id", session.user.id)
      .single();
    if (!budget) throw error;
    return budget.id;
  };

  const getIsAuth = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return session ? true : false;
  };

  return { getUserId, getBudgetId, getIsAuth };
};
