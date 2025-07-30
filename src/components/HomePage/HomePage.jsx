import useStore from '../../zustand/store'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function HomePage() {
  const user = useStore((state) => state.user);

  return (
    <div className='home-content bg-accent'>
      <section className='home-intro p-6'>
        <h1 className="hidden">Home Page</h1>
        <img src="avatar-mouse.png" alt="Your avatar image"/>
        <p className='text-4xl text-accent-foreground'>Hey, {user.username}</p>
        <p>What would you like to do today?</p>
        
      </section>
      
      <section className='home-content bg-white p-6 rounded-2xl'>
        <Card className='mb-6 bg-secondary'>
          <CardContent className='flex'>
            <div>
              <h2>Talk to Diana</h2>
              <p>Have a question or want to talk. Diana is here for you.</p>
              <Button asChild><a href="/chat-page">(icon) Let's Chat</a></Button>
            </div>
            <img src="diana-bubble.png" alt="Image of Diana in a bubble"/>
          </CardContent>
        </Card>
        <h2 className='text-2xl font-bold mb-4'>I want to learn</h2>
        <Card className='bg-accent'>
          <CardContent className='flex'>
            <div className='course-img bg-florapurple rounded-2xl mr-4'>
              <img src="avatar-bee.png"/>
            </div>
            
            <div className='course-card'>
              
              <h3>Sprouting Up</h3>
              <p>When signs of growth start to appear let’s be prepared!</p>
              <Button asChild><a href="#">Begin Course</a></Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
    </div>
  );
}


export default HomePage;
