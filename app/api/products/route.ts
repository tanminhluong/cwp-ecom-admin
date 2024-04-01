import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find().sort({ createdAt: "desc" }).populate({
      path: "collections",
      model: Collection,
    });

    if (!products)
      return new NextResponse("No products found", { status: 404 });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[Product_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      colors,
      sizes,
      tags,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create product", {
        status: 400,
      });
    }

    const newProduct = new Product({
      title,
      description,
      media,
      category,
      collections,
      colors,
      sizes,
      tags,
      price,
      expense,
    });

    await newProduct.save();

    for (const collectionId of collections) {
      const collection = await Collection.findById(collectionId);
      if (collection) {
        collection.products.push(newProduct._id);
        await collection.save();
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.log("[Product_POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
