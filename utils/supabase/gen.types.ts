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
      accounts: {
        Row: {
          budget_id: number;
          id: number;
          name: string;
          starting_balance: number;
          type: string;
        };
        Insert: {
          budget_id: number;
          id?: number;
          name: string;
          starting_balance?: number;
          type?: string;
        };
        Update: {
          budget_id?: number;
          id?: number;
          name?: string;
          starting_balance?: number;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets_view";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets: {
        Row: {
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          id?: number;
          name: string;
          user_id: string;
        };
        Update: {
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Budgets_user_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      envelopes: {
        Row: {
          budget_id: number;
          budgeted: number;
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          budget_id: number;
          budgeted?: number;
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          budget_id?: number;
          budgeted?: number;
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "envelopes_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "envelopes_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets_view";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
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
      transactions: {
        Row: {
          account_id: number;
          date: string;
          envelope_id: number | null;
          id: number;
          inflow: number | null;
          note: string | null;
          outflow: number | null;
        };
        Insert: {
          account_id: number;
          date: string;
          envelope_id?: number | null;
          id?: number;
          inflow?: number | null;
          note?: string | null;
          outflow?: number | null;
        };
        Update: {
          account_id?: number;
          date?: string;
          envelope_id?: number | null;
          id?: number;
          inflow?: number | null;
          note?: string | null;
          outflow?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_envelope_id_fkey";
            columns: ["envelope_id"];
            isOneToOne: false;
            referencedRelation: "envelopes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_envelope_id_fkey";
            columns: ["envelope_id"];
            isOneToOne: false;
            referencedRelation: "envelopes_view";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      accounts_view: {
        Row: {
          balance: number | null;
          budget_id: number | null;
          id: number | null;
          name: string | null;
          starting_balance: number | null;
          type: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets_view";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets_view: {
        Row: {
          balance: number | null;
          id: number | null;
          name: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Budgets_user_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      envelopes_view: {
        Row: {
          budget_id: number | null;
          budgeted: number | null;
          description: string | null;
          id: number | null;
          name: string | null;
          spent: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "envelopes_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "envelopes_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets_view";
            referencedColumns: ["id"];
          },
        ];
      };
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
