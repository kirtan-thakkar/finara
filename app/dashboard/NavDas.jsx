"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RiLogoutBoxLine } from "@remixicon/react";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
  },
];

const NavDas = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className={`text-xl font-bold text-primary ${outfit.className}`}>finara</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium tracking-tight transition-colors hover:text-primary ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground"
                    } ${outfit.className}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Log out button */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className={`text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950 ${outfit.className}`}
            >
              <RiLogoutBoxLine size={16} className="mr-2" />
              <span className="text-sm font-medium tracking-tight">Log out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium tracking-tight transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  } ${outfit.className}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavDas;