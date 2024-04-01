"use client";

import Delete from "@/components/Delete";
import { ProductType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <Link
          href={`/products/${row.original._id}`}
          className="hover:text-red-1"
        >
          {row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <p>{row.original.category}</p>;
    },
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) =>
      row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price ($)",
    cell: ({ row }) => {
      return <p>{row.original.price}</p>;
    },
  },
  {
    accessorKey: "expense",
    header: "Cost ($)",
    cell: ({ row }) => {
      return <p>{row.original.expense}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Delete item="product" id={row.original._id} />;
    },
  },
];
