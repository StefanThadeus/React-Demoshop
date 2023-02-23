import ProductModel from "./ProductModel";

type GetAllProductsModel = {
  lastPage: number;
  products: [ProductModel];
};

export default GetAllProductsModel;
