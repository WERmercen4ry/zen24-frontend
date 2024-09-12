import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import Loader from "../loader/Loader";
import { useContext } from "react";
import { LoaderContext } from "../loader/LoaderContext"; // Import LoaderContext

const FullLayout = () => {
  const { loading } = useContext(LoaderContext); // Lấy trạng thái loader từ context

  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {loading && <Loader />} {/* Hiển thị loader nếu loading là true */}
          {/********header**********/}
          <Header />
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
