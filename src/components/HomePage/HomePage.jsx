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
    <div className='home-content bg-(--accent)'>
      <section className='home-intro p-6'>
        <h1 className="hidden">Home Page</h1>
        <div className="flex items-center gap-4">
          <img 
              src={user.avatar && user.avatar.trim() !== "" 
                    ? user.avatar 
                    : "/avatar-mouse.png"} 
              alt="Your avatar image" 
              className="max-w-15" 
            />
          <div className="flex flex-col">
            <p className='text-2xl font-semibold text-pink-global text-accent-foreground'>Hey, {user.first_name || user.username}!</p>
            <p className='font-medium'>What would you like to do today?</p>
          </div>
        </div>
      </section>
      
      <section className='home-content bg-white p-6 rounded-2xl'>
        <Card className='mb-6 bg-secondary'>
          <CardContent className='flex'>
            <div className="space-y-4">
              <h2 className='text-xl font-semibold'>Talk to Diana</h2>
              <p>Have a question or want to talk? Diana is here for you.</p>
              <Button asChild size="default"><a href="/chat-page">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z" clipRule="evenodd" />
              </svg>
              Let's Chat</a></Button>
            </div>
            <img src="diana-bubble.png" alt="Image of Diana in a bubble"/>
          </CardContent>
        </Card>
        <h2 className='text-2xl font-bold mb-4'>I want to learn</h2>
        <Card className='bg-pink-global'>
          <CardContent className='flex'>
            <div className='course-img bg-florapurple rounded-2xl mr-4'>
              <img src="avatar-bee.png"/>
            </div>
            
            <div className='course-card space-y-2 '>
              <h3 className='font-semibold'>Sprouting Up</h3>
              <p>When signs of growth start to appear let’s be prepared!</p>
              <Button asChild size="default"><a href="#">Begin Course</a></Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
    </div>
  );
}


export default HomePage;
