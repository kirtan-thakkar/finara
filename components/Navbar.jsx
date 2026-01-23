"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {RiGoogleFill, RiLogoutBoxLine, RiUserLine} from "@remixicon/react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import * as React from "react";

export function Nav() {
  const { data: session, status } = useSession();
  
  const navItems = [
    {
      name: "company",
      link: "#company",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      console.log("Sign in button clicked"); // Debug log
      await signIn("google");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Sign out button clicked"); // Debug log
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Debug session state
  React.useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 relative z-[100]">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <RiUserLine size={16} />
                  <span className="hidden sm:block">{session.user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                >
                  <RiLogoutBoxLine size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleSignIn}
                disabled={status === "loading"}
              >
                <RiGoogleFill
                  className="me-2 text-[#DB4437] dark:text-white/60"
                  size={16}
                  aria-hidden="true"
                />
                {status === "loading" ? "Loading..." : "Login with Google"}
              </Button>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-2 p-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <RiUserLine size={16} />
                    <span>{session.user.name}</span>
                  </div>
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950 cursor-pointer"
                    type="button">
                    <RiLogoutBoxLine size={16} className="mr-2" />
                    Sign Out
                  </NavbarButton>
                </>
              ) : (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignIn();
                  }}
                  variant="primary"
                  disabled={status === "loading"}
                  className="w-full cursor-pointer"
                  type="button">
                  <RiGoogleFill size={16} className="mr-2" />
                  {status === "loading" ? "Loading..." : "Login with Google"}
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Navbar */}
    </div>
  );
}
