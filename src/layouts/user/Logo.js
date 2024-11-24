import logo from "../../assets/images/logos/ZenLogo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <img
        src={logo}
        alt="profile"
        className=""
        width="60"
      ></img>
      <p className="project-name">ZEN PILATES</p>
    </Link>
  );
};

export default Logo;
