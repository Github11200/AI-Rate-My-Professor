// page.tsx
"use client"
import { AiOutlineSketch } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuItem, NavigationMenuList } from "@/components/navigation-menu";


export default function Home() {
  return (
    <div className="relative">
      <NavigationMenu>
        <NavigationMenuTrigger>
          Menu
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="#home">Home</a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#about">About</a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#services">Services</a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#contact">Contact</a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenuContent>
      </NavigationMenu>
      <div className="container mx-auto p-4 mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">AI Rate My Professor</h1>
        <ButtonWithIcon />
      </div>
    </div>
  );
}

function ButtonWithIcon() {
  return (
    <Button className="flex items-center space-x-2">
      <AiOutlineSketch className="h-5 w-5" />
      <span>Click Here to Chat</span>
    </Button>
  );
}











