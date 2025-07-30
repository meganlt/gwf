import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-[#D1E9FF] text-black flex flex-col gap-6 rounded-[12px] border py-6 shadow-sm w-[350px] h-[226px] shrink-0",
        className
      )}
      {...props} />
  );
}


function CardContent({

  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props} />
  );
}


function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-[#414651] text-[20px] leading-[20px] font-bold",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-[#535862] text-[14px] font-semibold leading-[20px]",
        className
      )}
      {...props}
    />
  );
}


export {
  Card,
  CardContent,
  CardTitle,
  CardDescription,

}
