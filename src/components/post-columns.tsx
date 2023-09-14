import { type Post } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { PostOperations } from "./post-operations";
import { Checkbox } from "./ui/checkbox";
import { Icons } from "./icons";

export type PostColumn = Pick<Post, "id" | "title" | "published" | "createdAt">;

export const postColumns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "published",
    header: "Published",
    filterFn: (value, row) => {
      return value.original.published === (row === "true"); // not working
    },
    cell: ({ row }) => (
      <>
        {row.original.published ? (
          <Icons.check className="w- h-4" />
        ) : (
          <Icons.close className="h-4 w-4" />
        )}
      </>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <PostOperations post={row.original} />;
    },
  },
];
