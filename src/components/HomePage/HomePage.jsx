import useStore from '../../zustand/store'
import { Button } from "@/components/ui/button"


function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);

  return (
    <>
      <h1 className="text-3xl">Home Page</h1>
      <p>Your username is: {user.username}</p>
      <p>Your ID is: {user.id}</p>
      <Button variant="outline" onClick={logOut}>
        Log Out
      </Button>
    </>
  );
}


export default HomePage;
