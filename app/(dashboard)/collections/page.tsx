"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/DataTable";
import { columns } from "./_components/CollectionColumn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CollectionType } from "@/lib/types";

const ColletionPage = () => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const router = useRouter();
  const getCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/collections", {
        method: "GET",
      });

      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.log("[collection_GET]", error);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div className="px-10 py-5">
      <div className="flex justify-between items-center ">
        <h1 className="text-heading1-bold">Collections</h1>
        <Button
          onClick={() => router.push("/collections/new")}
          className="bg-blue-1 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Collection
        </Button>
      </div>
      <Separator className="my-3 bg-grey-1" />
      <DataTable columns={columns} data={collections} searchKey="title" />
    </div>
  );
};

export default ColletionPage;
