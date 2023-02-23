import axios from "axios";
import DashboardModel from "../models/DashboardModel";

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  baseURL: "https://demoshop-api.training.dev.logeecom.com/",
});

const DashboardService = {
  getDashboardStatistics: async function (): Promise<
    DashboardModel | undefined
  > {
    try {
      const { data: response } = await api.get("dashboard");

      return {
        categoriesCount: response.categoriesCount,
        mostViewedProductCount: response.mostViewedProductCount,
        homePageOpenings: response.homePageOpenings,
        mostViewedProductName: response.mostViewedProductName,
        productsCount: response.productsCount,
      };
    } catch (error) {
      alert(error);
      return undefined;
    }
  },
};

export default DashboardService;
