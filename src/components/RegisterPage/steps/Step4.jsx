import { Button } from "@/components/ui/button"
import clsx from "clsx"

const avatars = [
  "/avatar-alien.png",
  "/avatar-clown.png",
  "/avatar-mime.png",
  "/avatar-mouse.png",
  "/avatar-super.png",
  "/avatar-unicorn.png",
  "/avatar-woman1.png",
  "/avatar-woman2.png",
  "/avatar-woman3.png",
]

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
            <img
                src={avatar}
                alt="Avatar"
                className="w-16 h-16"
              />
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