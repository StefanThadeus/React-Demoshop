import axios from "axios";
import CategoryModel from "../models/CategoryModel";

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  baseURL: "https://demoshop-api.training.dev.logeecom.com/",
});

const CategoryService = {
  getAllCategories: async function (): Promise<CategoryModel[] | undefined> {
    try {
      const { data: response } = await api.get("categories/all");

      return response;
    } catch (error) {
      alert(error);
      return undefined;
    }
  },

  getCategoryChildren: async function (
    id: number
  ): Promise<CategoryModel[] | undefined> {
    try {
      const { data: response } = await api.get(
        "admin/categories/loader/" + String(id)
      );

      return response;
    } catch (error) {
      alert(error);
      return undefined;
    }
  },

  createCategory: async function (
    parentId: number,
    code: string,
    title: string,
    description: string
  ): Promise<boolean> {
    try {
      const { data: response } = await api.post("admin/categories", {
        parentId: parentId,
        code: code,
        title: title,
        description: description,
      });

      return response;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  updateCategory: async function (
    id: number,
    parentId: number,
    code: string,
    title: string,
    description: string
  ): Promise<boolean> {
    try {
      const { data: response } = await api.put(
        "admin/categories/" + String(id),
        {
          parentId: parentId,
          code: code,
          title: title,
          description: description,
        }
      );

      return response;
    } catch (error) {
      alert(error);
      return false;
    }
  },

  deleteCategory: async function (id: number): Promise<boolean> {
    try {
      const { data: response } = await api.delete(
        "admin/categories/" + String(id)
      );

      return response;
    } catch (error) {
      alert(error);
      return false;
    }
  },
};
export default CategoryService;
