import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Quản lý khách hàng",
    href: "/admin/customers-manager",
    icon: "bi bi-people",
  },
  {
    title: "Quản lý gói",
    href: "/admin/package-manager",
    icon: "bi bi-box-seam",
  },
  {
    title: "Thời khoá biểu",
    href: "/admin/timetables",
    icon: "bi bi-card-text",
  },
  {
    title: "Giao dịch",
    href: "/admin/transactions",
    icon: "bi bi-columns-gap",
  },
  {
    title: "Chi nhánh",
    href: "/admin/locations",
    icon: "bi bi-geo-alt-fill",
  },
  // {
  //   title: "Nhận diện khuôn mặt",
  //   href: "/admin/starter",
  //   icon: "bi bi-person-bounding-box",
  // },

];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg mb-2">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "text-primary nav-link py-3"
                    : "nav-link text-primary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
