import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Products from "./products/Products";
import ProductCategories from "./product-categories/ProductCatgories";
import Sidebar, { SideMenuOption } from "./sidebar/Sidebar";
import Login from "./login/Login";
import PrivateRoute from "./private-route/PrivateRoute";
import ProductPage, { ProductPageMode } from "./product-page/ProductPage";
import ErrorPage from "./error-page/ErrorPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Sidebar menuOption={1} />
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Sidebar menuOption={SideMenuOption.Dashboard} />
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Sidebar menuOption={SideMenuOption.Products} />
            <Products />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/create"
        element={
          <PrivateRoute>
            <Sidebar menuOption={SideMenuOption.Products} />
            <ProductPage mode={ProductPageMode.Create} />
          </PrivateRoute>
        }
      />
      <Route
        // :sku represents dynamic parameter which can be later accessed via useParams
        path="/products/edit/:sku"
        element={
          <PrivateRoute>
            <Sidebar menuOption={SideMenuOption.Products} />
            <ProductPage mode={ProductPageMode.Edit} />
          </PrivateRoute>
        }
      />
      <Route
        path="/product-categories"
        element={
          <PrivateRoute>
            <Sidebar menuOption={SideMenuOption.ProductCategories} />
            <ProductCategories />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
