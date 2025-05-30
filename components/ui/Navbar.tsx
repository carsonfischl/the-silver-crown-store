import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import ConvexClientProvider from "../ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { auth, currentUser } from '@clerk/nextjs/server'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


type Props = {}

async function Navbar({}: Props) {
  return (
    <html lang="en">
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                  <Authenticated>
                    <UserButton />
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton />
                  </Unauthenticated>
              </NavigationMenuList>
            </NavigationMenu>
            </ConvexClientProvider>
        </ClerkProvider>
    </html>
  );
}
export default Navbar;