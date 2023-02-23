import axios from "axios";
import GetAllProductsModel from "../models/GetAllProductsModel";
import ProductModel from "../models/ProductModel";

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  baseURL: "https://demoshop-api.training.dev.logeecom.com/",
});

const ProductService = {
  getProductData: async function (
    pageNumber: number,
    itemsPerPage: number
  ): Promise<GetAllProductsModel | undefined> {
    try {
      const { data: response } = await api.get(
        "products/" + pageNumber + "/" + itemsPerPage
      );

      return { lastPage: response.lastPage, products: response.products };
    } catch (error) {
      alert(error);
      return undefined;
    }
  },

  getProductBySKU: async function (
    sku: string
  ): Promise<ProductModel | undefined> {
    try {
      const { data: response } = await api.get("products/" + sku);

      return response;
    } catch (error) {
      alert(error);
      return undefined;
    }
  },

  enableProducts: async function (list: number[]): Promise<boolean> {
    try {
      await api.put("products/multiple/enable", JSON.stringify(list));
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  disableProducts: async function (list: number[]): Promise<boolean> {
    try {
      await api.put("products/multiple/disable", JSON.stringify(list));
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  deleteProduct: async function (productId: number): Promise<boolean> {
    try {
      await api.delete("products/delete/" + productId);

      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  addProduct: async function (product: ProductModel): Promise<boolean> {
    try {
      await api.post("products/create", JSON.stringify(product));

      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  updateProduct: async function (
    product: ProductModel,
    SKU: string
  ): Promise<boolean> {
    try {
      await api.post("products/update/" + SKU, JSON.stringify(product));

      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  uploadImage: async function (image: File): Promise<boolean> {
    try {
      await api.post("products/create/image", image);

      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  },
};

export default ProductService;
