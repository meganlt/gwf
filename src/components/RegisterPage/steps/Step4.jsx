import { Button } from "@/components/ui/button"
import clsx from "clsx"

const avatars = ["👩", "👨", "🧑", "👧", "🧔", "👩‍🦱"]

function Step4({ data, onNext, onBack, onUpdate }) {
  return (
    <div className="space-y-4 text-center">
      <Button variant="ghost" onClick={onBack}>(arrow) Back</Button>
      <h2 className="text-2xl font-bold">Choose an avatar</h2>
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            onClick={() => onUpdate({ avatar })}
            className={clsx(
              "text-4xl p-2 rounded-full border transition",
              data.avatar === avatar ? "border-blue-500" : "border-gray-300"
            )}
          >
            {avatar}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <Button onClick={onNext} disabled={!data.avatar}>Continue</Button>
      </div>
    </div>
  )
}
export default Step4;