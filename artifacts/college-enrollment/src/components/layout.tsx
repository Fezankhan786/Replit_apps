import React from "react";
import { Link } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Westview University Logo" className="h-8 w-8" />
            <span className="font-bold text-primary text-xl hidden sm:inline-block">Westview University</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">Courses</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Show when="signed-out">
              <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
              <Link href="/admission">
                <Button>Apply Now</Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User avatar"} />
                      <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.publicMetadata?.role === 'admin' ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Student Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Show>
          </div>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-white px-4 py-4 flex flex-col gap-4">
            <Link href="/" onClick={toggleMobileMenu} className="text-sm font-medium">Home</Link>
            <Link href="/courses" onClick={toggleMobileMenu} className="text-sm font-medium">Courses</Link>
            <Link href="/about" onClick={toggleMobileMenu} className="text-sm font-medium">About</Link>
            <Link href="/contact" onClick={toggleMobileMenu} className="text-sm font-medium">Contact</Link>
            <div className="h-px bg-border my-2" />
            <Show when="signed-out">
              <Link href="/sign-in" onClick={toggleMobileMenu} className="text-sm font-medium">Sign In</Link>
              <Link href="/admission" onClick={toggleMobileMenu}>
                <Button className="w-full mt-2">Apply Now</Button>
              </Link>
            </Show>
            <Show when="signed-in">
              {user?.publicMetadata?.role === 'admin' ? (
                <Link href="/admin" onClick={toggleMobileMenu} className="text-sm font-medium">Admin Dashboard</Link>
              ) : (
                <Link href="/dashboard" onClick={toggleMobileMenu} className="text-sm font-medium">Student Dashboard</Link>
              )}
              <Button variant="outline" className="w-full mt-2" onClick={() => signOut()}>Sign out</Button>
            </Show>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold text-xl">Westview</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Empowering minds and shaping the future since 1965. A tradition of excellence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/courses" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">Programs & Courses</Link></li>
              <li><Link href="/admission" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">Admissions</Link></li>
              <li><Link href="/about" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>123 University Ave, Boston, MA 02110</li>
              <li>+1 (555) 123-4567</li>
              <li>admissions@westview.edu</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Westview University. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
