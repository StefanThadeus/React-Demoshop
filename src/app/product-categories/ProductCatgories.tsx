import React, { useEffect, useState } from "react";
import "./ProductCategories.css";
import FunctionalButton, {
  ButtonColorOptions,
} from "../functional-button/FunctionalButton";
import CategoryService from "../../services/CategoryService";
import CategoryModel from "../../models/CategoryModel";
import Spinner from "../spinner/Spinner";
import SpecialSelect from "../special-select/SpecialSelect";

enum ModeOfOperation {
  Preview,
  Edit,
  CreateRoot,
  CreateSub,
}

type TreeViewCategory = {
  category: CategoryModel;
  expanded?: boolean;
  children?: TreeViewCategory[];
};

const ProductCategories: React.FC = () => {
  const [modeOfOperation, setModeOfOperation] = useState<ModeOfOperation>(
    ModeOfOperation.Preview
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryModel[]>();
  const [treeView, setTreeView] = useState<TreeViewCategory[]>();
  const [category, setCategory] = useState<CategoryModel>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number>();

  function buildTree(allCategories: CategoryModel[]): void {
    let treeView: TreeViewCategory[] = [];

    // fill roots
    for (let i = 0; i < allCategories.length; i++) {
      if (allCategories[i].parentId === null) {
        treeView.push({
          category: allCategories[i],
          expanded: false,
          children: [],
        });
      }
    }

    // for each root element, fill children list if children exist
    for (let i = 0; i < treeView.length; i++) {
      treeView[i].children = getChildren(
        treeView[i].category.id,
        allCategories
      );
    }

    console.log(treeView);
    setTreeView(treeView);
  }

  function getChildren(
    id: number,
    allCategories: CategoryModel[]
  ): TreeViewCategory[] {
    let list: TreeViewCategory[] = [];

    for (let i = 0; i < allCategories.length; i++) {
      if (allCategories[i].parentId === id) {
        list.push({
          category: allCategories[i],
          expanded: false,
          children: [],
        });
      }
    }

    // for each root element, fill children list if children exist
    for (let i = 0; i < list.length; i++) {
      list[i].children = getChildren(list[i].category.id, allCategories);
    }

    return list;
  }

  function getCategoriesList(): string[] | undefined {
    let list: string[] = ["No parent"];
    let categoryList = categories?.map(({ id }) => String(id));
    if (categoryList !== undefined) {
      list = list.concat(categoryList);
    }

    return list;
  }

  function saveCategory(): void {
    if (category !== undefined) {
      if (modeOfOperation === ModeOfOperation.Edit) {
        CategoryService.updateCategory(
          category.id,
          category.parentId,
          category.code,
          category.title,
          category.description
        ).then((response) => {
          if (response) {
            alert("Category successfully updated!");

            // update categories state for page rerender
            CategoryService.getAllCategories().then((data) => {
              if (data) {
                buildTree(data);
              }
            });
          }
        });
      } else {
        if (modeOfOperation === ModeOfOperation.CreateRoot) {
          CategoryService.createCategory(
            0,
            category.code,
            category.title,
            category.description
          ).then((response) => {
            if (response) {
              alert("Root category successfully created!");

              // update categories state for page rerender
              CategoryService.getAllCategories().then((data) => {
                if (data) {
                  buildTree(data);
                }
              });
            }
          });
        } else if (modeOfOperation === ModeOfOperation.CreateSub) {
          CategoryService.createCategory(
            category.parentId,
            category.code,
            category.title,
            category.description
          ).then((response) => {
            if (response) {
              alert("Subcategory successfully created!");

              // update categories state for page rerender
              CategoryService.getAllCategories().then((data) => {
                if (data) {
                  buildTree(data);
                }
              });
            }
          });
        }
      }
    }

    setModeOfOperation(ModeOfOperation.Preview);
  }

  function deleteCategory(): void {
    if (category?.id !== undefined) {
      if (
        // eslint-disable-next-line no-restricted-globals
        confirm(
          "Are you sure that you would like to delete category " +
            category.title +
            "?"
        )
      ) {
        CategoryService.deleteCategory(category.id).then((response) => {
          if (response) {
            alert("Category successfully deleted!");

            // update categories state for page rerender
            CategoryService.getAllCategories().then((data) => {
              if (data) {
                buildTree(data);
              }
            });
            setCategory(undefined);
          }
        });
      }
    } else {
      alert("You must select a category first!");
    }
  }

  function getChildrenHTMLList(
    childrenCategories: TreeViewCategory[] | undefined
  ) {
    if (childrenCategories === undefined) {
      return <></>;
    } else {
      return (
        <ul>
          {childrenCategories?.map((currentCategory, index) => {
            // check if category has children
            let hasChildren = currentCategory.children?.length !== 0;

            return (
              <li key={index}>
                {/* display arrow if category has children */}
                {hasChildren && currentCategory.expanded === false && (
                  <span
                    className="clickable selectable"
                    onClick={() => {
                      currentCategory.expanded = true;
                      setExpanded(!expanded);
                    }}
                  >
                    ▶{" "}
                  </span>
                )}
                {hasChildren && currentCategory.expanded === true && (
                  <span
                    className="clickable selectable"
                    onClick={() => {
                      currentCategory.expanded = false;
                      setExpanded(!expanded);
                    }}
                  >
                    ◢{" "}
                  </span>
                )}
                <span
                  className={
                    "clickable selectable" +
                    (selectedCategory === currentCategory.category.id
                      ? " selected"
                      : "")
                  }
                  onClick={(e) => {
                    setCategory(currentCategory.category);
                  }}
                >
                  {currentCategory.category.title}
                </span>
                {hasChildren &&
                  currentCategory.expanded === true &&
                  getChildrenHTMLList(currentCategory.children)}
              </li>
            );
          })}
        </ul>
      );
    }
  }

  function modeTitle(): string {
    let title = "";

    switch (modeOfOperation) {
      case ModeOfOperation.Preview:
        title = "Selected Category";
        break;
      case ModeOfOperation.Edit:
        title = "Edit Category";
        break;
      case ModeOfOperation.CreateRoot:
        title = "Create Root Category";
        break;
      case ModeOfOperation.CreateSub:
        title = "Create Subcategory";
    }

    return title;
  }

  useEffect(() => {
    setLoaded(false);

    CategoryService.getAllCategories()
      .then((data) => {
        if (data) {
          buildTree(data);
          setCategories(data);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  // update selected category highlight
  if (category) {
    if (
      selectedCategory !== category.id &&
      modeOfOperation === ModeOfOperation.Preview
    ) {
      setSelectedCategory(category.id);
    }
  }

  return (
    <main className="product-category-page">
      <div className="category-main-container">
        <h1>Product Categories</h1>
        <div className="category-preview-split-grid">
          <div className="category-preview-single-side-grid">
            <h2>Categories:</h2>
            <div
              className={
                "category-options-container" +
                (modeOfOperation !== ModeOfOperation.Preview ? " disabled" : "")
              }
            >
              {
                // show the spinner only if not loaded
                !loaded && <Spinner />
              }
              {loaded && (
                <ul>
                  {treeView?.map((currentCategory, index) => {
                    // don't display non-root categories on top level
                    if (currentCategory.category.parentId !== null) {
                      return <></>;
                    }

                    // check if category has children
                    let hasChildren = currentCategory.children?.length !== 0;

                    return (
                      <li key={index}>
                        {/* display arrow if category has children */}
                        {hasChildren && currentCategory.expanded === false && (
                          <span
                            className="clickable selectable"
                            onClick={() => {
                              currentCategory.expanded = true;
                              setExpanded(!expanded);
                            }}
                          >
                            ▶{" "}
                          </span>
                        )}
                        {hasChildren && currentCategory.expanded === true && (
                          <span
                            className="clickable selectable"
                            onClick={() => {
                              currentCategory.expanded = false;
                              setExpanded(!expanded);
                            }}
                          >
                            ◢{" "}
                          </span>
                        )}
                        <span
                          className={
                            "clickable selectable" +
                            (selectedCategory === currentCategory.category.id
                              ? " selected"
                              : "")
                          }
                          onClick={(e) => {
                            setCategory(currentCategory.category);
                          }}
                        >
                          {currentCategory.category.title}
                        </span>
                        {hasChildren &&
                          currentCategory.expanded === true &&
                          getChildrenHTMLList(currentCategory.children)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="category-button-grid-left">
              <FunctionalButton
                buttonText={"➕  Add Root Category"}
                clickEvent={() => {
                  setCategory(undefined);
                  setSelectedCategory(undefined);
                  setModeOfOperation(ModeOfOperation.CreateRoot);
                }}
              />
              <FunctionalButton
                buttonText={"➕  Add Subcategory"}
                clickEvent={() => {
                  setCategory(undefined);
                  setSelectedCategory(undefined);
                  setModeOfOperation(ModeOfOperation.CreateSub);
                }}
              />
            </div>
          </div>
          <div className="category-preview-single-side-grid">
            <h2>{modeTitle()}:</h2>
            <div className="category-options-container">
              <div className="category-edit-grid">
                <div>Title:</div>
                <input
                  placeholder="Category title"
                  readOnly={!modeOfOperation}
                  value={category !== undefined ? category.title : ""}
                  onChange={(e) => {
                    // @ts-ignore
                    setCategory((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                  }}
                />
                <div>Parent category:</div>
                <SpecialSelect
                  selectOptions={getCategoriesList()}
                  disabled={
                    modeOfOperation === ModeOfOperation.Preview ||
                    modeOfOperation === ModeOfOperation.CreateRoot
                  }
                  onChangeFunction={(e) => {
                    // @ts-ignore
                    setCategory((prev) => ({
                      ...prev,
                      parentId: Number(e.target.value),
                    }));
                  }}
                  selectedValue={
                    modeOfOperation === ModeOfOperation.CreateRoot
                      ? "No parent"
                      : String(category?.parentId)
                  }
                />
                <div>Category code:</div>
                <input
                  placeholder="Category code"
                  readOnly={!modeOfOperation}
                  value={category !== undefined ? category.code : ""}
                  onChange={(e) => {
                    // @ts-ignore
                    setCategory((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }));
                  }}
                />
                <div className="description-label">Description:</div>
                <textarea
                  placeholder="Category description"
                  rows={9}
                  readOnly={!modeOfOperation}
                  value={category !== undefined ? category.description : ""}
                  onChange={(e) => {
                    // @ts-ignore
                    setCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="category-button-grid-right">
              <FunctionalButton
                buttonText={
                  modeOfOperation === ModeOfOperation.Preview
                    ? "✖️  Delete"
                    : "🚫  Cancel"
                }
                clickEvent={
                  modeOfOperation === ModeOfOperation.Preview
                    ? () => {
                        deleteCategory();
                      }
                    : () => {
                        setCategory(undefined);
                        setSelectedCategory(undefined);
                        setModeOfOperation(ModeOfOperation.Preview);
                      }
                }
                color={
                  modeOfOperation === ModeOfOperation.Preview
                    ? ButtonColorOptions.Red
                    : ButtonColorOptions.Gray
                }
              />
              <FunctionalButton
                buttonText={
                  modeOfOperation === ModeOfOperation.Preview
                    ? "✏️  Edit"
                    : "️✔️  Save Changes"
                }
                clickEvent={() => {
                  modeOfOperation === ModeOfOperation.Preview
                    ? category !== undefined
                      ? setModeOfOperation(ModeOfOperation.Edit)
                      : alert("You must select a category first!")
                    : saveCategory();
                }}
                color={ButtonColorOptions.Blue}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductCategories;
