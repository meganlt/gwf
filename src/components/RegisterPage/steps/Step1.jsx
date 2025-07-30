import { Button } from "@/components/ui/button"

function Step1({ onNext }) {
  return (
    <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Before we begin</h2>
        <p>
        Please ask a parent or guardian to help you set up your Flora account.</p>
        <p>Flora is designed for younger users and we are required by law to get permission from a parent or guardian before you can use the app.</p>
        <Button onClick={onNext}>Continue</Button>
    </div>
  )
}
export default Step1;