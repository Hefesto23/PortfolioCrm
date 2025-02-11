// src/components/ui/Table.tsx
import { clsx } from "clsx";
import { forwardRef } from "react";

// We'll create individual components for each table part for better composition
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={clsx("w-full caption-bottom text-sm", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

// Header component for the table
const Header = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx("bg-gray-50 border-b border-gray-200", className)}
    {...props}
  />
));
Header.displayName = "TableHeader";

// Body component for the table
const Body = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clsx("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
Body.displayName = "TableBody";

// Row component
const Row = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx(
      "border-b border-gray-200 transition-colors hover:bg-gray-50/50",
      className
    )}
    {...props}
  />
));
Row.displayName = "TableRow";

// Header cell component
const Head = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={clsx(
      "h-12 px-4 text-left align-middle font-medium text-gray-500",
      "whitespace-nowrap",
      className
    )}
    {...props}
  />
));
Head.displayName = "TableHead";

// Regular cell component
const Cell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={clsx(
      "p-4 align-middle",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
Cell.displayName = "TableCell";

// Export the compound component
export { Body, Cell, Head, Header, Row, Table };
