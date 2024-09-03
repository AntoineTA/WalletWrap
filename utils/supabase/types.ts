import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./gen.types";
export type { Json } from "./gen.types";

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      /* Due to a SQL limitation, fields in views are always considered nullable even
      when they are not in practice (given the definition of the view).
      Thus, we manually override the type generated by the database for the views */
      Views: {
        envelopes_view: {
          Row: {
            budget_id: number;
            budgeted: number;
            description: string | null;
            id: number;
            name: string;
            spent: number;
          };
        };
        budgets_view: {
          Row: {
            balance: number;
            created_at: string;
            description: string;
            id: number;
            name: string;
            user_id: string;
          };
        };
      };
    };
  }
>;
