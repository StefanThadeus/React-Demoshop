import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import DashboardService from "../../services/DashboardService";
import Spinner from "../spinner/Spinner";
import DashboardModel from "../../models/DashboardModel";

const Dashboard: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardModel>();

  useEffect(() => {
    // fetch dashboard data if not fetched
    setLoaded(false);
    DashboardService.getDashboardStatistics()
      .then((data) => setDashboardData(data))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-main-container">
        {
          // show the spinner only if not loaded
          !loaded && <Spinner />
        }
        {
          // show the rest only if data loaded
          loaded && (
            <>
              <div className="dashboard-grid-item-span-max">
                <h1>Dashboard</h1>
                <h2>Statistics:</h2>
              </div>
              <div className="dashboard-grid-item-span-max dashboard-group-area">
                <div>
                  Products count:{" "}
                  <input
                    id="productCountInput"
                    className="dashboard-form-input-area-short"
                    type="text"
                    readOnly={true}
                    placeholder="Number of products"
                    value={dashboardData?.productsCount}
                  />
                </div>
                <div>
                  Home page opening count:{" "}
                  <input
                    id="homepageCountInput"
                    className="dashboard-form-input-area-long"
                    type="text"
                    readOnly={true}
                    placeholder="Number of products"
                    value={dashboardData?.homePageOpenings}
                  />
                </div>
                <div>
                  Categories count:{" "}
                  <input
                    id="categoriesCountInput"
                    className="dashboard-form-input-area-short"
                    type="text"
                    readOnly={true}
                    placeholder="Number of products"
                    value={dashboardData?.categoriesCount}
                  />
                </div>
                <div>
                  Most often viewed product:{" "}
                  <input
                    id="mostViewedProductInput"
                    className="dashboard-form-input-area-long"
                    type="text"
                    readOnly={true}
                    placeholder="Number of products"
                    value={dashboardData?.mostViewedProductName}
                  />
                </div>
                <div className="dashboard-final-grid-item">
                  Number of {dashboardData?.mostViewedProductName} views:{" "}
                  <input
                    id="mostViewedProductCountInput"
                    className="dashboard-form-input-area-long"
                    type="text"
                    readOnly={true}
                    placeholder="Number of products"
                    value={dashboardData?.mostViewedProductCount}
                  />
                </div>
              </div>
            </>
          )
        }
      </div>
    </main>
  );
};

export default Dashboard;
