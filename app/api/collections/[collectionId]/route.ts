import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await connectToDB();

    const collection = await Collection.findById(params.collectionId);

    if (!collection)
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("[COLLECTION_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    const { title, description, image } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    await connectToDB();

    let collection = await Collection.findById(params.collectionId);

    if (!collection)
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );

    if (!image || !title)
      return new NextResponse("Title and Image are required", { status: 400 });

    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      {
        title,
        description,
        image,
      },
      { new: true }
    );

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("[COLLECTION_PUT]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    await connectToDB();

    await Collection.findByIdAndDelete(params.collectionId);

    await Product.updateMany(
      {
        collections: params.collectionId,
      },
      {
        $pull: {
          collections: params.collectionId,
        },
      }
    );

    return NextResponse.json("Collection is deleted", { status: 200 });
  } catch (error) {
    console.log("[COLLECTION_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
