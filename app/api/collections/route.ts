import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    await connectToDB();

    const { title, image, description } = await req.json();

    const existingCollection = await Collection.findOne({ title });

    if (existingCollection)
      return new NextResponse("Collection already exists", { status: 409 });

    if (!title || !image)
      return new NextResponse("Image and title are required", { status: 400 });

    const newCollection = await Collection.create({
      title,
      image,
      description,
    });

    await newCollection.save();

    return NextResponse.json(newCollection, { status: 200 });
  } catch (error) {
    console.log("[COLLECTION_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const collections = await Collection.find().sort({ createdAt: "desc" });

    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.log("[COLLECTION_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
