import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react"
import useStore from '../../zustand/store';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';

const steps = [Step1, Step2, Step3, Step4, Step5 ];

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const register = useStore((state) => state.register);
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    age: "",
    avatar: "",
    gender: "",
    pronouns: "",
  })
  const next = () => {
    setStep((s) => Math.min(s + 1, steps.length - 1))
    console.log('form data so far: ', formData);
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const StepComponent = steps[step]
  const isLastStep = step === steps.length - 1

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleRegister = () => {
    register(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StepComponent
            data={formData}
            onNext={next}
            onBack={back}
            onUpdate={updateData}
            {...(isLastStep ? { handleRegister } : {})}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


export default RegisterPage;
