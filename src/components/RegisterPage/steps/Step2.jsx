import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Step2({ data, onNext, onBack, onUpdate }) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}>(arrow) Back</Button>
      <h2 className="text-2xl font-bold text-center">Create your profile</h2>
      <Input placeholder="First Name" value={data.firstName} onChange={(e) => onUpdate({ firstName: e.target.value })} />
      <Input placeholder="Last Name" value={data.lastName} onChange={(e) => onUpdate({ lastName: e.target.value })} />
      <Input placeholder="Email" type="email" value={data.username} onChange={(e) => onUpdate({ username: e.target.value })} />
      <Input placeholder="Password" type="password" value={data.password} onChange={(e) => onUpdate({ password: e.target.value })} />
      <div className="flex justify-between">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  )
}
export default Step2;