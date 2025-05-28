"use client"

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren } from "react";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

/**
 * This provider setup integrates Clerk (authentication) with Convex (backend database).
 * It wraps your application to enable:
 * 1. User authentication through Clerk
 * 2. Secure communication with your Convex backend
 * 3. Real-time data synchronization
 * 
 * Make sure you have set the following environment variables:
 * - NEXT_PUBLIC_CONVEX_URL: Your Convex deployment URL
 * - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Your Clerk public key
 * 
 * Theme Configuration:
 * To enable theme toggling:
 * 1. Remove forcedTheme prop by commenting out the line in the ThemeProvider component
 * 2. Set enableSystem to true
 * 3. Uncomment the following in your header component:
 * 
 * <ModeToggle />
 */

export function Providers({children}: PropsWithChildren) {
  return (
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
  )
}
