import useStore from '../../zustand/store'
import { Button } from "@/components/ui/button"



function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);

  return (
    <>
      <h1 className="text-3xl">Home Page</h1>
      <img src="avatar-mouse.png" alt="Your avatar image"/>
      <p>Hey, {user.username}</p>
      <p>Your ID is: {user.id}</p>
      <p>What would you like to do today?</p>
      <Button variant="outline" onClick={logOut}>
        Log Out
      </Button>
      <section>
        <img src="diana-bubble.png" alt="Image of Diana in a bubble"/>
        <h2>Talk to Diana</h2>
        <p>Have a question or want to talk. Diana is here for you.</p>
        <Button asChild><a href="#">(icon) Let's Chat</a></Button>
      </section>
      <section>
        <h2>I want to learn</h2>
        <div className='course-card'>
          <img src="https://placecats.com/100/200"/>
          <h3>Sprouting Up</h3>
          <p>When signs of growth start to appear let’s be prepared!</p>
           <Button asChild><a href="#">Begin Course</a></Button>
        </div>
      </section>
    </>
  );
}


export default HomePage;
