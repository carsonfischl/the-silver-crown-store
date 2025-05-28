'use node'


import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { internalAction } from "./_generated/server";
import { Webhook } from 'svix'
import { v } from "convex/values";
import { internal, users } from "./_generated/api";
import { createUser } from "./users";


// This webhook handler processes Clerk authentication events:
// - user.created: Creates a new user record and (optionally) sends welcome email
// - user.deleted: Removes user data and performs cleanup
//
// Webhook secret must be configured in environment variables as CLERK_WEBHOOK_SECRET
// See: https://clerk.com/docs/users/sync-data#webhook-endpoints


export const fullfill = internalAction({
 args: {headers: v.any(), payload: v.string() },
 handler: async (ctx, args) => {
   const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
   const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
  
   // Handle user creation - send welcome email
   if (payload.type === 'user.created') {
     const userId = payload.data.id;
     const email = payload.data.email_addresses[0]?.email_address;
    
     if (email) {
        await ctx.runMutation(internal.users.createUser, {
            userId,
            email,
            username: payload.data.username ?? ''
        });
    //    await ctx.runMutation(users.createUser, {
    //      userId,
    //      email,
    //      username: payload.data.username ?? ''
    //    });
    //    await ctx.runAction(internal.sendEmails.sendWelcomeEmail, {
    //      to: email,
    //      username: payload.data.username ?? ''
    //    });
     }
   }


   // Handle user deletion event
   if (payload.type === 'user.deleted') {
     try {
       const userId = payload.data.id;
       if (!userId) {
         console.error('User deletion webhook received without userId');
         return;
       }
      
       await ctx.runMutation(internal.users.handleUserDeletion, { userId });
     } catch (error) {
       console.error('Error handling user deletion:', error);
       throw error; // Re-throw to ensure Clerk knows the webhook failed
     }
   }
  
   return payload;
 }
});