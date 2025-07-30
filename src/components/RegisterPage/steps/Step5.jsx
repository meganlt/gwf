
import { useState, useEffect } from 'react';
import useStore from '../../../zustand/store';
import { Button } from "@/components/ui/button";

function Step5({ data, onBack, handleRegister }) {
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  const handleSubmit = () => {
    handleRegister(data);
  }

  useEffect(() => {
      // Clear the auth error message when the component unmounts:
      return () => {
        setAuthErrorMessage('');
      }
    }, [])

  return (
    <div className="space-y-6 text-center">
      <Button variant="ghost" onClick={onBack}>(arrow) Back</Button>  
      <h2 className="text-2xl font-bold">One last step!</h2>
      <p className="text-gray-600 text-sm">
        Please review our final terms and confirm your registration.
      </p>
      <div className="flex justify-between">
        <Button onClick={handleSubmit}>Confirm</Button>
      </div>
      { // Conditionally render registration error:
        errorMessage && (
          <h3>{errorMessage}</h3>
        )
      }
    </div>
  )
}
export default Step5;