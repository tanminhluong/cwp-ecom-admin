"use client";

import { ProductType } from "@/lib/types";
import { useEffect, useState } from "react";
import ProductForm from "../_components/ProductForm";
import Loader from "@/components/Loader";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${params.productId}`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setLoading(false);
        }
      } catch (error) {
        console.log("[product_GET]", error);
      }
    };
    getProductDetails();
  }, [params.productId]);

  return loading ? <Loader /> : <ProductForm initialData={product} />;
};

export default ProductDetails;
