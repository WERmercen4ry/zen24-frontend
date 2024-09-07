import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Container } from "reactstrap";

const FullLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <div className="contentArea">
          {/********header**********/}
          <Header />
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
