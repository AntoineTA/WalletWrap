export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Accounts: {
        Row: {
          balance: number;
          budget: number;
          created_at: string;
          id: number;
          name: string;
          type: Database["public"]["Enums"]["account_types"];
        };
        Insert: {
          balance?: number;
          budget: number;
          created_at?: string;
          id?: number;
          name: string;
          type?: Database["public"]["Enums"]["account_types"];
        };
        Update: {
          balance?: number;
          budget?: number;
          created_at?: string;
          id?: number;
          name?: string;
          type?: Database["public"]["Enums"]["account_types"];
        };
        Relationships: [
          {
            foreignKeyName: "Accounts_budget_fkey";
            columns: ["budget"];
            isOneToOne: false;
            referencedRelation: "Budgets";
            referencedColumns: ["id"];
          },
        ];
      };
      Budgets: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          name: string;
          user: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: number;
          name: string;
          user: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          name?: string;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Budgets_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      Settings: {
        Row: {
          has_mfa: boolean;
          id: string;
          username: string | null;
        };
        Insert: {
          has_mfa?: boolean;
          id: string;
          username?: string | null;
        };
        Update: {
          has_mfa?: boolean;
          id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "settings_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      Transactions: {
        Row: {
          account: number | null;
          amount: number;
          created_at: string;
          date: string;
          id: number;
          is_inflow: boolean;
          note: string | null;
        };
        Insert: {
          account?: number | null;
          amount: number;
          created_at?: string;
          date?: string;
          id?: number;
          is_inflow?: boolean;
          note?: string | null;
        };
        Update: {
          account?: number | null;
          amount?: number;
          created_at?: string;
          date?: string;
          id?: number;
          is_inflow?: boolean;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Transactions_account_fkey";
            columns: ["account"];
            isOneToOne: false;
            referencedRelation: "Accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      account_types: "checking" | "saving" | "liability";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
