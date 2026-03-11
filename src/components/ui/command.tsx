"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search as SearchIcon, Check as CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function CommandPalette({
  title = "Command Palette",
  description = "Search for a command to run...",
  className,
  ...props
}: React.ComponentProps<typeof Command> & {
  title?: string
  description?: string
}) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 text-xs border border-[#1f521f] bg-[#0a0a0a] text-[#33ff00] hover:bg-[#1f521f] transition-all cursor-pointer"
      >
        <span className="opacity-70">CTRL+K</span>
        <span className="text-glow">SEARCH</span>
      </button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogContent
          className={cn(
            "top-[15%] translate-y-0 overflow-hidden rounded-none! p-0 border border-[#1f521f] bg-[#0a0a0a] sm:max-w-3xl",
            className
          )}
          showCloseButton={false}
        >
          <Command {...props} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof Command.Input>) {
  return (
    <div className="flex items-center border-b border-[#1f521f] px-3">
      <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <Command.Input
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#33ff00]/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof Command.List>) {
  return (
    <Command.List
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden p-1",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof Command.Empty>) {
  return (
    <Command.Empty
      className={cn("py-6 text-center text-sm text-[#33ff00]/60", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof Command.Group>) {
  return (
    <Command.Group
      className={cn(
        "overflow-hidden p-1 text-[#33ff00]/60",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Command.Separator>) {
  return (
    <Command.Separator
      className={cn("-mx-1 h-px bg-[#1f521f]", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof Command.Item>) {
  return (
    <Command.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-[#33ff00] data-[selected=true]:bg-[#1f521f] data-[selected=true]:text-[#33ff00]",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandPalette,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}
