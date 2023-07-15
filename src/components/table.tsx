import * as React from "react";
import { cn } from "~/lib/utils";

export interface TableProps extends React.AllHTMLAttributes<HTMLElement> {}

const Table = {
  Table: React.forwardRef<HTMLTableElement, TableProps>(
    ({ children, className, ...props }, ref) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} ref={ref} {...props}>
          {children}
        </table>
      </div>
    )
  ),
  THead: React.forwardRef<HTMLTableSectionElement, TableProps>(
    ({ children, className, ...props }, ref) => (
      <thead className={cn("", className)} ref={ref} {...props}>
        {children}
      </thead>
    )
  ),
  TBody: React.forwardRef<HTMLTableSectionElement, TableProps>(
    ({ children, className, ...props }, ref) => (
      <tbody className={cn("", className)} ref={ref} {...props}>
        {children}
      </tbody>
    )
  ),
  TR: React.forwardRef<HTMLTableRowElement, TableProps>(
    ({ children, className, ...props }, ref) => (
      <tr
        className={cn("m-0 border-t p-0 even:bg-muted", className)}
        ref={ref}
        {...props}
      >
        {children}
      </tr>
    )
  ),
  TH: React.forwardRef<HTMLTableCellElement, TableProps>(
    ({ children, className, ...props }, ref) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </th>
    )
  ),
  TD: React.forwardRef<HTMLTableCellElement, TableProps>(
    ({ children, className, ...props }, ref) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </td>
    )
  ),
};

Table.Table.displayName = "Table.Table";
Table.THead.displayName = "Table.THead";
Table.TBody.displayName = "Table.TBody";
Table.TR.displayName = "Table.TR";
Table.TH.displayName = "Table.TH";
Table.TD.displayName = "Table.TD";

export default Table;
