import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Put all routes you want only authenticated users to see in this array.
// /dashboard(.*) means all routes nested under dashboard require      authentication to access
const isProtectedRoute = createRouteMatcher(
  [
    '/dashboard(.*)', 
  ])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
// This middleware will protect all routes that match the isProtectedRoute matcher.
// If a user is not authenticated, they will be redirected to the sign-in page.