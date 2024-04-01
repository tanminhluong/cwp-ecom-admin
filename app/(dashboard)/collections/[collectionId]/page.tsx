import Collection from "@/lib/models/Collection";
import React from "react";
import CollectionsForm from "../_components/CollectionsForm";
import { CollectionType } from "@/lib/types";

type Props = {
  params: {
    collectionId: string;
  };
};
const CollectionDetail = async ({ params }: Props) => {
  const collection = await Collection.findOne({ _id: params.collectionId });

  const formatData: CollectionType = {
    _id: collection._id.toString(),
    title: collection.title,
    description: collection.description,
    image: collection.image,
    products: collection.products,
  };

  return <CollectionsForm initialData={formatData} />;
};

export default CollectionDetail;
