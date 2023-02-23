type ProductModel = {
  id: number;
  categoryId: number;
  SKU: string;
  title: string;
  brand: string;
  price: number;
  shortDescription: string;
  description: string;
  image?: string;
  featured: boolean;
  enable: boolean;
  viewCount?: number;
  categoryPath?: string;
};
export default ProductModel;
