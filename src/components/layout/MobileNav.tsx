
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";

interface MobileNavProps {
  onClose: () => void;
}

export default function MobileNav({ onClose }: MobileNavProps) {
  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Community Nexus</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <NavLinks className="flex flex-col space-y-3" onNavClick={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
