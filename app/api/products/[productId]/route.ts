import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: "Collection",
    });

    if (!product)
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[product_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const POST = async (
  req: NextResponse,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) return new NextResponse("Product not found", { status: 404 });

    const {
      title,
      description,
      media,
      price,
      expense,
      category,
      colors,
      sizes,
      tags,
      collections,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense)
      return new NextResponse("Not enough data to uodate product", {
        status: 400,
      });

    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );

    await Promise.all([
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: {
            products: product._id,
          },
        })
      ),
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: {
            products: product._id,
          },
        })
      ),
    ]);

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        price,
        expense,
        category,
        colors,
        sizes,
        tags,
        collections,
      },
      { new: true }
    ).populate({ path: "collections", model: "Collection" });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log("[product_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextResponse,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) return new NextResponse("Product not found", { status: 404 });

    await Product.findByIdAndDelete(product._id);

    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: {
            products: product._id,
          },
        })
      )
    );

    return NextResponse.json({ message: "Delete success" }, { status: 200 });
  } catch (error) {
    console.log("[product_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
