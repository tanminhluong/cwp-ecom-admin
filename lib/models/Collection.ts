import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    image: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Collection =
  mongoose.models?.Collection || mongoose.model("Collection", CollectionSchema);

export default Collection;