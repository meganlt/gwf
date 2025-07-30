import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import { Button } from "@/components/ui/button"

function Nav() {
  const user = useStore((store) => store.user);
  const logOut = useStore((state) => state.logOut);


  return (
    <nav>
      <ul>
      { // User is not logged in, render these links:
        !user.id && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/registration">Register</NavLink>
            </li>
          </>
        )
      }
      { // User is logged in, render these links:
        user.id && (
          <>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li><NavLink to="/chat-page">Diana</NavLink></li>
            <li><NavLink to="/profile">User Profile</NavLink></li>
            <li><Button variant="outline" onClick={logOut}>
          Log Out
        </Button></li>
          </>
        )
      }
      {/* Show these links regardless of auth status: */}
        {/* <li>
          <NavLink to="/about">About</NavLink>
        </li> */}
      </ul>
    </nav>
  );
}


export default Nav;
