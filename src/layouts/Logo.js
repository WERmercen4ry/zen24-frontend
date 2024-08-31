import logo from "../assets/images/logos/ZenLogo.png";
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
      <p>Zen Pilates</p>
    </Link>
  );
};

export default Logo;
