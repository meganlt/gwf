import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card"


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const logIn = useStore((state) => state.logIn)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleLogIn = (event) => {
    event.preventDefault();

    logIn({
      username: username,
      password: password,
    })
  };

  return (
    <>

      <h2>Login Page</h2>
      <form onSubmit={handleLogIn}>
        <label htmlFor="username">Email</label>
        <Input
          placeholder="Enter email"
          type="text"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <Input
          placeholder="Enter password"
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="primary" size="default" type="submit">
          Log In
        </Button>
        {/* tester button for secondary button color styling */}
         <Button variant="secondary" size="default" type="submit">
          Log In
        </Button>
      </form>
      { // Conditionally render login error:
        errorMessage && (
          <h3>{errorMessage}</h3>
        )
      }
      <Card>
        <CardContent>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <Button variant="primary" size="default" type="submit">
            Log In
          </Button>
        </CardContent>
      </Card>
    </>
  );
}


export default LoginPage;
