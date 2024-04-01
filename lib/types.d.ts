export type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
};

export type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: string[];
  category: string;
  collections: CollectionType[];
  colors: string[];
  sizes: string[];
  tags: string[];
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
};
