import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Loader from "../loader/Loader";
import { Container } from "reactstrap";
import { useContext } from "react";
import { LoaderContext } from "../loader/LoaderContext"; 
const FullLayout = () => {
  const { loading } = useContext(LoaderContext);
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <div className="contentArea">
          {/********header**********/}
          <Header />
          {loading && <Loader />}
          {/********Middle Content**********/}
          <Container className="wrapper-user " fluid>
            <Outlet />
          </Container>
          <Footer></Footer>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
