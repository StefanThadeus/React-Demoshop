import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import SpecialCheckbox from "../special-checkbox/SpecialCheckbox";
import FunctionalButton, {
  ButtonColorOptions,
} from "../functional-button/FunctionalButton";
import SpecialSelect from "../special-select/SpecialSelect";
import Spinner from "../spinner/Spinner";
import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import ProductModel from "../../models/ProductModel";
import CategoryModel from "../../models/CategoryModel";

export enum ProductPageMode {
  Create = "Create",
  Edit = "Edit",
}

type Props = {
  mode: ProductPageMode;
};

type RouteParams = {
  sku?: string;
};

const ProductPage: React.FC<Props> = ({ mode }) => {
  const { sku } = useParams<RouteParams>();

  const initialImage =
    "https://www.sarras-shop.com/out/pictures/master/product/1/no-image-available-icon.jpg";
  const [imageSource, setImageSource] = useState(initialImage);

  const [loaded, setLoaded] = useState<boolean>(false);
  const [productData, setProductData] = useState<ProductModel>();
  const [categories, setCategories] = useState<CategoryModel[]>();

  const inputValidation = (): boolean => {
    let imgDimensions = new Image();
    imgDimensions.src = imageSource;
    if (
      imgDimensions.width / imgDimensions.height < 1.333 ||
      imgDimensions.width / imgDimensions.height > 1.778 ||
      imgDimensions.width < 600
    ) {
      alert(
        "Image aspect ratio must be between 4:3 and 16:9, with minimal image width being 600px."
      );
      return false;
    }

    if (isNaN(productData?.price as number)) {
      alert("Price in unacceptable format!");
      return false;
    }

    return true;
  };

  const saveProduct = () => {
    if (
      !productData?.SKU ||
      !productData?.title ||
      !productData?.brand ||
      !productData?.categoryId ||
      !productData?.price ||
      !productData?.shortDescription ||
      !productData?.description
    ) {
      alert("All input fields must filled!");
      return;
    }

    if (!inputValidation()) {
      return;
    }

    if (mode === ProductPageMode.Create) {
      ProductService.addProduct({
        ...productData,
        id: 0,
      }).then((r) => {
        if (r) {
          alert("Product added successfully!");
          window.location.href = "/products";

          if (imageSource !== initialImage) {
            // @ts-ignore
            let image = new File(imageSource, productSKU);
            ProductService.uploadImage(image);
          }
        }
      });
    } else {
      ProductService.updateProduct(
        {
          ...productData,
          id: 0,
        },
        String(sku)
      ).then((r) => {
        if (r) {
          alert("Product updated successfully!");
          window.location.href = "/products";

          if (imageSource !== initialImage) {
            // @ts-ignore
            let image = new File(imageSource, productSKU);
            ProductService.uploadImage(image);
          }
        }
      });
    }
  };

  useEffect(() => {
    setLoaded(false);

    let productFetch;
    if (mode === ProductPageMode.Edit) {
      productFetch = ProductService.getProductBySKU(String(sku)).then(
        (data) => {
          if (data !== undefined) {
            setProductData(data);
          } else {
            window.location.href = "/error";
          }
        }
      );
    }

    let categoryFetch = CategoryService.getAllCategories().then((data) =>
      setCategories(data)
    );

    let promisesList;
    if (mode === ProductPageMode.Edit) {
      promisesList = [productFetch, categoryFetch];
    } else {
      promisesList = [categoryFetch];
    }

    Promise.all(promisesList).then(() => {
      setLoaded(true);
    });
  }, [mode, sku]);

  return (
    <main className="product-page">
      {
        // show the spinner only if not loaded
        !loaded && (
          <div className="product-spinner">
            <Spinner />
          </div>
        )
      }
      {
        // show the rest only if data loaded
        loaded && (
          <div className="product-main-container">
            <div className="product-grid-item-span-max">
              <h1>{mode + " product"}</h1>
              <h2>Product details:</h2>
            </div>
            <div className="product-left-grid">
              <div>SKU:</div>
              <div>
                <input
                  className="product-form-input-area-short"
                  type="text"
                  placeholder="Product SKU"
                  defaultValue={
                    mode === ProductPageMode.Create ? "" : productData?.SKU
                  }
                  onChange={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      SKU: e.target.value,
                    }));
                  }}
                  readOnly={mode === ProductPageMode.Edit}
                />
              </div>
              <div>Title:</div>
              <div>
                <input
                  className="product-form-input-area-short"
                  type="text"
                  placeholder="Product title"
                  defaultValue={
                    mode === ProductPageMode.Create ? "" : productData?.title
                  }
                  onChange={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                  }}
                />
              </div>
              <div>Brand:</div>
              <div>
                <input
                  className="product-form-input-area-short"
                  type="text"
                  placeholder="Product brand"
                  defaultValue={
                    mode === ProductPageMode.Create ? "" : productData?.brand
                  }
                  onChange={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      brand: e.target.value,
                    }));
                  }}
                />
              </div>
              <div>Category:</div>
              <div>
                {/*extracts id field from categories into separate array*/}
                <SpecialSelect
                  id={"productCategory"}
                  selectOptions={categories?.map((a) => a.id)}
                  selectedValue={productData?.categoryId}
                  onChangeFunction={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      categoryId: Number(e.target.value),
                    }));
                  }}
                />
              </div>
              <div>Price:</div>
              <div>
                <input
                  className="product-form-input-area-short"
                  type="text"
                  placeholder="Product price"
                  defaultValue={
                    mode === ProductPageMode.Create ? "" : productData?.price
                  }
                  onChange={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }));
                  }}
                />
              </div>
              <div className="top-align">Short description:</div>
              <div className="top-align">
                <textarea
                  className="product-form-input-area-short"
                  rows={5}
                  placeholder="Short product description"
                  defaultValue={
                    mode === ProductPageMode.Create
                      ? ""
                      : productData?.shortDescription
                  }
                  onChange={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      shortDescription: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="top-align">Long description:</div>
              <div className="top-align">
                <textarea
                  className="product-form-input-area-short"
                  rows={9}
                  placeholder="Long product description"
                  defaultValue={
                    mode === ProductPageMode.Create
                      ? ""
                      : productData?.description
                  }
                  onChange={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                />
              </div>
              <div />
              <div className="left-align">
                <SpecialCheckbox
                  label={"Enabled in shop"}
                  groupName={"checkmark"}
                  isChecked={productData?.enable}
                  onChangeFunction={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      enable: e.target.checked,
                    }));
                  }}
                />
              </div>
              <div />
              <div>
                <SpecialCheckbox
                  label={"Featured"}
                  groupName={"checkmark"}
                  isChecked={productData?.featured}
                  onChangeFunction={(e) => {
                    // @ts-ignore
                    setProductData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="product-right-grid">
              <div>Image:</div>
              <img id="image" alt="product" src={imageSource} />
              <div />
              <div>
                <input
                  id="picture-upload"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageSource(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
              <div />
              <div className="top-align">
                <FunctionalButton
                  buttonText={"✔️  Save Product"}
                  color={ButtonColorOptions.Blue}
                  clickEvent={() => {
                    saveProduct();
                  }}
                />
              </div>
              <div />
              <div className="top-align">
                <FunctionalButton
                  buttonText={"🚫️  Cancel"}
                  color={ButtonColorOptions.Gray}
                  clickEvent={() => {
                    window.location.href = "/products";
                  }}
                />
              </div>
            </div>
          </div>
        )
      }
    </main>
  );
};

export default ProductPage;
