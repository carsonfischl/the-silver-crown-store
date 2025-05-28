//   handler: httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature") as string;


//     const result = await ctx.runAction(internal.stripe.fullfill, {
//       payload: await request.text(),
//       signature,
//     });


//     if (result.success) {
//       return new Response(null, {
//         status: 200,
//       });
//     } else {
//       return new Response("Webhook Error", {
//         status: 400,
//       });
//     }
//   }),
// });


// Delete Clerk User
// Ensure http is imported or defined
 // Replace 'some-http-library' with the actual library or module providing 'http'

 import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";




const http = httpRouter()


//Stripe Webhook
// http.route({
//   path: "/stripe",
//   method: "POST",


http.route({
    path: "/clerk/users/:userId",
    method: "DELETE",
    handler: httpAction(async (ctx, request) => {
      const url = new URL(request.url);
      const userId = url.pathname.split("/").pop();
   
   
      if (!process.env.CLERK_SECRET_KEY) {
        return new Response("Clerk secret key not configured", { status: 500 });
      }
   
   
      try {
        const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });
   
   
        if (!response.ok) {
          return new Response("Failed to delete user from Clerk", { status: 400 });
        }
   
   
        return new Response(null, { status: 200 });
      } catch (error) {
        console.error("Error deleting user from Clerk:", error);
        return new Response("Internal server error", { status: 500 });
      }
    }),
   });
   
   
   //Clerk Webhook
   http.route({
    path: '/clerk',
    method: 'POST',
    handler: httpAction(async (ctx, request) => {
      const payloadString = await request.text();
      const headerPayload = request.headers;
   
   
      try {
        const result = await ctx.runAction(internal.clerk.fullfill, {
          payload: payloadString,
          headers: {
            "svix-id": headerPayload.get("svix-id")!,
            "svix-timestamp": headerPayload.get("svix-timestamp")!,
            "svix-signature": headerPayload.get("svix-signature")!,
          },
        });
   
   
        if (result) {
          return new Response(null, { status: 200 });
        }
        return new Response("Webhook Error", { status: 400 });
      } catch (err) {
        console.error("Webhook error:", err);
        return new Response("Webhook Error", { status: 400 });
      }
    })
   });
   
   
   export default http;
   