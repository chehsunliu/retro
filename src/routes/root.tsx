import { Outlet, Link } from "react-router-dom";

function Root() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to={""}>Home</Link>
          </li>
          <li>
            <Link to={"pal"}>PAL</Link>
          </li>
          <li>
            <Link to={"swd-2e"}>SWD2E</Link>
          </li>
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default Root;
