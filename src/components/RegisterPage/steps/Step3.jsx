import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const genderOptions = ["Girl/Woman", "Boy/Man", "Non-binary", "Genderfluid", "Agender", "Intersex", "Bigender", "Prefer not to say"];
const pnOptions = [ "She/Her", "He/Him", "They/Them", "Ze/Zir", "Xe/Xem", "It/Its"];

function Step3({ data, onNext, onBack, onUpdate }) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}>(arrow) Back</Button>  
      <h2 className="text-2xl font-bold text-center">How old are you?</h2>
      <Select value={data.age} onValueChange={(value) => onUpdate({ age: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Select your age" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="9">9</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="11">11</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="13">13</SelectItem>
          <SelectItem value="14+">14+</SelectItem>
        </SelectContent>
      </Select>
      <h2 className="text-2xl font-bold text-center">What are your pronouns?</h2>
      <Select value={data.pronouns} onValueChange={(value) => onUpdate({ pronouns: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Select your pronouns" />
        </SelectTrigger>
        <SelectContent>
          {pnOptions.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <h2 className="text-2xl font-bold text-center">What is your gender identity?</h2>
      <Select value={data.gender} onValueChange={(value) => onUpdate({ gender: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Select your gender identity" />
        </SelectTrigger>
        <SelectContent>
          {genderOptions.map((g) => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex justify-between">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  )
}
export default Step3;