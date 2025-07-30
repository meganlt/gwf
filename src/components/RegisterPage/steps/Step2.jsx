import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Step2({ data, onNext, onBack, onUpdate }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button variant="ghost" onClick={onBack}>(arrow) Back</Button>
      <h2 className="text-2xl font-bold text-center">Create your profile</h2>
      <Input placeholder="First Name" required value={data.firstName} onChange={(e) => onUpdate({ firstName: e.target.value })} />
      <Input placeholder="Last Name" required value={data.lastName} onChange={(e) => onUpdate({ lastName: e.target.value })} />
      <Input placeholder="Email" required type="email" value={data.username} onChange={(e) => onUpdate({ username: e.target.value })} />
      <Input placeholder="Password" required type="password" value={data.password} onChange={(e) => onUpdate({ password: e.target.value })} />
      <div className="flex justify-between">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}
export default Step2;