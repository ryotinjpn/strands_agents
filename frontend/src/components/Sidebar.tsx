"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, MessageSquare, Bot } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Chat", href: "/chat", icon: MessageSquare },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`flex h-full flex-col fixed inset-y-0 z-50 bg-card border-r transform transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 translate-x-0' : 'w-16 translate-x-0'
      }`}>
      <div className={`flex h-16 shrink-0 items-center ${isOpen ? 'justify-between px-6' : 'justify-center px-2'}`}>
        <div className="flex items-center">
          <Bot 
            className="h-8 w-8 text-primary cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && <span className="ml-2 text-xl font-bold">Strands Agents</span>}
        </div>
      </div>
      <nav className={`flex flex-1 flex-col pb-4 ${isOpen ? 'px-6' : 'px-2'}`}>
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                  !isOpen && "justify-center"
                )}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                {isOpen && item.name}
              </Link>
            </li>
          ))}
        </ul>
        </nav>
      </div>
    </>
  )
}