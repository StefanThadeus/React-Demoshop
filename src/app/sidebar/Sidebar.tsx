import React from "react";
import "./Sidebar.css";
import LoginService from "../../services/LoginService";
import SpecialButton from "../special-button/SpecialButton";

export enum SideMenuOption {
  Dashboard,
  Products,
  ProductCategories,
}

type Props = {
  menuOption: SideMenuOption;
};

const Sidebar: React.FC<Props> = ({ menuOption }) => {
  function logOut() {
    debugger;
    LoginService.logoutUser();
  }

  return (
    <aside className="sidenav">
      <span className="sidenav-heading">DemoShop</span>
      <a
        className={
          "sidenav-item" +
          (menuOption === SideMenuOption.Dashboard
            ? " sidenav-item-selected"
            : "")
        }
        href="/dashboard"
      >
        Dashboard
      </a>
      <a
        className={
          "sidenav-item" +
          (menuOption === SideMenuOption.Products
            ? " sidenav-item-selected"
            : "")
        }
        href="/products"
      >
        Products
      </a>
      <a
        className={
          "sidenav-item" +
          (menuOption === SideMenuOption.ProductCategories
            ? " sidenav-item-selected"
            : "")
        }
        href="/product-categories"
      >
        Product Categories
      </a>
      <div className="sidenav-item">
        <div className="logout-button-positioning">
          <SpecialButton buttonText={"Log Out"} clickEvent={logOut} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
