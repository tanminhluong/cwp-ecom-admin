"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/DataTable";
import { columns } from "./_components/ProductColumn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductType } from "@/lib/types";
import Loader from "@/components/Loader";

const ProductsPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const router = useRouter();

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "GET",
      });

      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log("[collection_GET]", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex justify-between items-center ">
        <h1 className="text-heading1-bold">Products</h1>
        <Button
          onClick={() => router.push("/products/new")}
          className="bg-blue-1 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Product
        </Button>
      </div>
      <Separator className="my-3 bg-grey-1" />
      <DataTable columns={columns} data={products} searchKey="title" />
    </div>
  );
};

export default ProductsPage;
