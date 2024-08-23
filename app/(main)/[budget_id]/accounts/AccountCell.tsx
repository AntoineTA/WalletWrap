// Adapted from https://muhimasri.com/blogs/react-editable-table/

import { useEffect, useState } from "react";
import type { Table, Row } from "@tanstack/react-table";
import { Transaction } from "./page";

type AccountCellProps<Transaction> = {
  getValue: () => any;
  row: Row<Transaction>;
  table: Table<Transaction>;
};

const AccountCell = ({
  getValue,
  row,
  table,
}: AccountCellProps<Transaction>) => {
  const meta = table.options.meta!;
  const accounts = meta.metadata.accounts;
  const account_id: number = getValue();

  if (meta?.editedRows[row.id]) {
    return (
      <select
        value={account_id}
        onChange={(event) => {
          const intValue = parseInt(event.target.value);
          meta.updateCell(row.index, "account_id", intValue);
        }}
      >
        {accounts.map((account: { id: number; name: string }) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span>{accounts.find((account) => account.id === account_id)?.name}</span>
  );
};
export { AccountCell };

// const meta = table.options.meta!;
// const initialValue = getValue();
// const initialDisplay: string = meta.metadata.accounts[0].name;
// const [display, setDisplay] = useState(initialDisplay);

// // useEffect(() => {
// //   setDisplay(initialValue);
// // }, [initialValue]);

// // If the row is being edited, return the select field
// if (meta?.editedRows[row.id]) {
//   return (
//     <select
//       value={initialValue}
//       onChange={(event) => {
//         console.log(event.target.value);
//         // setDisplay(event.target.value);
//         // meta.updateCell(row.index, "account_id", event.target.value);
//       }}
//     >
//       {meta.metadata.accounts.map((account: { id: number; name: string }) => (
//         <option key={account.id} value={account.id}>
//           {account.name} - {account.id}
//         </option>
//       ))}
//     </select>
//   );
// }

// return <span>{display}</span>;
