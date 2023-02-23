import React, { useState } from "react";
import "./Products.css";
import FunctionalButton, {
  ButtonColorOptions,
} from "../functional-button/FunctionalButton";
import ProductTable from "../product-table/ProductTable";
import ProductService from "../../services/ProductService";
import { useSearchParams } from "react-router-dom";

const Products: React.FC = (props, context) => {
  const [searchParams, setSearchParams] = useSearchParams();
  let initialPage = 1;
  let searchParam = searchParams.get("page");
  if (searchParam) {
    initialPage = parseInt(searchParam);
  }

  // child element "ProductTable" receives this variable to update page
  const [page, setPage] = useState(initialPage);

  // unchecks all checkboxes
  const clearSelection = () => {
    let allCheckboxes = document.getElementsByName("checkmark") as NodeList;

    // uses TSLIB to return NodeList Iterator
    for (let values of allCheckboxes.values()) {
      if (values instanceof HTMLInputElement) {
        values.checked = false;
      }
    }
  };

  // enables selected products
  const enableSelection = () => {
    let allCheckboxes = document.getElementsByName("checkmark") as NodeList;
    let list: number[] = [];

    // uses TSLIB to return NodeList Iterator
    for (let values of allCheckboxes.values()) {
      if (values instanceof HTMLInputElement) {
        if (values.checked) {
          let id = values.getAttribute("data-product-id");
          if (id) {
            list.push(parseInt(id));
          }
        }
      }
    }

    ProductService.enableProducts(list);

    // enable checkboxes
    allCheckboxes = document.getElementsByName("enable-switch") as NodeList;
    // uses TSLIB to return NodeList Iterator
    for (let values of allCheckboxes.values()) {
      if (values instanceof HTMLInputElement) {
        let id = values.getAttribute("data-product-id");
        if (id) {
          if (!values.checked && list.includes(parseInt(id))) {
            values.checked = true;
          }
        }
      }
    }
  };

  // disables selected products
  const disableSelection = () => {
    let allCheckboxes = document.getElementsByName("checkmark") as NodeList;
    let list: number[] = [];

    // uses TSLIB to return NodeList Iterator
    for (let values of allCheckboxes.values()) {
      if (values instanceof HTMLInputElement) {
        if (values.checked) {
          let id = values.getAttribute("data-product-id");
          if (id) {
            list.push(parseInt(id));
          }
        }
      }
    }

    ProductService.disableProducts(list);

    // enable checkboxes
    allCheckboxes = document.getElementsByName("enable-switch") as NodeList;
    // uses TSLIB to return NodeList Iterator
    for (let values of allCheckboxes.values()) {
      if (values instanceof HTMLInputElement) {
        let id = values.getAttribute("data-product-id");
        if (id !== null) {
          if (values.checked && list.includes(parseInt(id))) {
            values.checked = false;
          }
        }
      }
    }
  };

  // deletes selected products
  const deleteSelection = () => {
    let allCheckboxes = document.getElementsByName("checkmark") as NodeList;

    // uses TSLIB to return NodeList Iterator
    for (let values of allCheckboxes.values()) {
      if (values instanceof HTMLInputElement) {
        if (values.checked) {
          let id = values.getAttribute("data-product-id");
          if (id) {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm("Are you sure you want to delete product with id: " + id)
            ) {
              ProductService.deleteProduct(parseInt(id));
            }
          }
        }
      }
    }
  };

  // sets page number to load, sent to child element "ProductTable"
  const getPage = (pageNumber: number) => {
    //setPage(pageNumber);
    window.location.href = "products?page=" + pageNumber;
  };

  return (
    <main className="products-page">
      <div className="products-main-container">
        <div className="products-grid-item-span-max">
          <h1>Products</h1>
        </div>
        <FunctionalButton
          buttonText={"➕  Add New Product"}
          clickEvent={() => {
            window.location.href = "products/create";
          }}
        />
        <FunctionalButton
          buttonText={"✖️  Delete Selected"}
          clickEvent={() => {
            deleteSelection();
          }}
          color={ButtonColorOptions.Red}
        />
        <FunctionalButton
          buttonText={"✔️ Enable Selected"}
          clickEvent={() => {
            enableSelection();
          }}
        />
        <FunctionalButton
          buttonText={"🚫  Disable Selected"}
          clickEvent={() => {
            disableSelection();
          }}
          color={ButtonColorOptions.Gray}
          minWidth={true}
        />
        <span className="products-grid-item-span-end">
          <FunctionalButton
            buttonText={"🔲  Clear Selection"}
            clickEvent={clearSelection}
            color={ButtonColorOptions.Blue}
          />
        </span>
        <div className="products-grid-item-span-max products-group-area">
          <ProductTable
            pageNumber={page}
            itemsPerPage={5}
            changePage={getPage}
          />
        </div>
      </div>
    </main>
  );
};

export default Products;
