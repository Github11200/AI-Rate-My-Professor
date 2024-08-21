// page.tsx
import { AiOutlineSketch } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import NavigationMenuDemo from "@/components/navigation-menu";

export default function Home() {
  return (
    <div className="relative">
      <NavigationMenuDemo />
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










