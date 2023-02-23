import React, { useEffect, useState } from "react";
import "./ProductTable.css";
import SpecialCheckbox from "../special-checkbox/SpecialCheckbox";
import FunctionalButton, {
  ButtonColorOptions,
} from "../functional-button/FunctionalButton";
import SpecialSlider from "../special-slider/SpecialSlider";
import Spinner from "../spinner/Spinner";
import ProductService from "../../services/ProductService";
import productService from "../../services/ProductService";
import GetAllProductsModel from "../../models/GetAllProductsModel";

type Props = {
  pageNumber: number;
  itemsPerPage: number;
  changePage: (pageNumber: number) => void;
};

const ProductTable: React.FC<Props> = (props) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [contentChanged, setContentChanged] = useState(false);
  const [productData, setProductData] = useState<GetAllProductsModel>();

  useEffect(() => {
    setLoaded(false);

    ProductService.getProductData(props.pageNumber, props.itemsPerPage)
      .then((data) => setProductData(data))
      .finally(() => setLoaded(true));
  }, [props.itemsPerPage, props.pageNumber, contentChanged]);

  return (
    <>
      {
        // show the spinner only if data not loaded
        !loaded && <Spinner />
      }
      {loaded && (
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th>Selected</th>
                <th>
                  <div>Title</div>
                </th>
                <th>SKU</th>
                <th>
                  <div>Brand</div>
                </th>
                <th>
                  <div>Category</div>
                </th>
                <th>
                  <div>Short description</div>
                </th>
                <th>
                  <div>Price</div>
                </th>
                <th>Enable</th>
              </tr>
            </thead>
            <tbody id="table-body">
              {productData?.products?.map((product, index) => {
                // fill list **************************************************************
                return (
                  <tr className="product-row" key={index}>
                    <td>
                      <SpecialCheckbox
                        checkboxId={"1"}
                        groupName={"checkmark"}
                        label={"Select"}
                        data={product.id}
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.SKU}</td>
                    <td>{product.brand}</td>
                    <td>{product.categoryId}</td>
                    <td>{product.shortDescription}</td>
                    <td>{product.price + "$"}</td>
                    <td>
                      <SpecialSlider
                        productId={product.id.toString()}
                        groupName="enable-switch"
                        checked={product.enable}
                        eventFunctionChecked={() => {
                          ProductService.enableProducts([product.id]);
                        }}
                        eventFunctionUnchecked={() => {
                          ProductService.disableProducts([product.id]);
                        }}
                      />
                    </td>
                    <td>
                      <FunctionalButton
                        buttonText={"Edit"}
                        clickEvent={() => {
                          window.location.href = "products/edit/" + product.SKU;
                        }}
                        color={ButtonColorOptions.Blue}
                      />
                    </td>
                    <td>
                      <FunctionalButton
                        buttonText={"Delete"}
                        clickEvent={() => {
                          if (
                            // eslint-disable-next-line no-restricted-globals
                            confirm(
                              "Are you sure you want to delete product with id: " +
                                product.id
                            )
                          ) {
                            productService
                              .deleteProduct(product.id)
                              .then(() => setContentChanged(!contentChanged));
                          }
                        }}
                        color={ButtonColorOptions.Red}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="page-group-area">
            <FunctionalButton
              buttonText={"<<"}
              clickEvent={() => {
                if (props.pageNumber !== 1) {
                  props.changePage(1);
                }
              }}
              color={ButtonColorOptions.Blue}
              constrainHeight={true}
            />
            <FunctionalButton
              buttonText={"<"}
              clickEvent={() => {
                if (props.pageNumber > 1) {
                  props.changePage(props.pageNumber - 1);
                }
              }}
              constrainHeight={true}
            />
            <div className="page-background">
              {props.pageNumber + " / " + productData?.lastPage}
            </div>
            <FunctionalButton
              buttonText={">"}
              clickEvent={() => {
                if (productData) {
                  if (props.pageNumber + 1 <= productData.lastPage) {
                    props.changePage(props.pageNumber + 1);
                  }
                }
              }}
              constrainHeight={true}
            />
            <FunctionalButton
              buttonText={">>"}
              clickEvent={() => {
                if (productData) {
                  props.changePage(productData.lastPage);
                }
              }}
              color={ButtonColorOptions.Blue}
              constrainHeight={true}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductTable;
