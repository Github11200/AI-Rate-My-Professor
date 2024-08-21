// navigation-menu.tsx

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";

export default function NavigationMenuDemo() {
  return (
    <nav className="bg-black p-4">
      <NavigationMenu className="text-white">
        <NavigationMenuList className="flex flex-col space-y-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-black text-white">
              Getting Started
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-black text-white">
              <ul className="p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="/" className="text-blue-600 hover:underline">
                      Overview
                    </a>
                  </NavigationMenuLink>
                </li>
                {/* Add more items as needed */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-black text-white">
              Documentation
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-black text-white">
              <ul className="p-4">
                <li>
                  <Link href="/docs">
                    <a className="text-blue-600 hover:underline">Documentation</a>
                  </Link>
                </li>
                {/* Add more items as needed */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}








