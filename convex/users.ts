
import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

/**
 * Creates a new user in the database if they don't already exist
 * Use this when: 
 * - Setting up authentication
 * - Creating new user accounts
 * - Handling OAuth callbacks
 * Note: This is an internal mutation, meant to be called from other Convex functions, not directly from the client
 */
export const createUser = internalMutation({
  args: {email: v.string(), userId: v.string(), username: v.string(), role: v.optional(v.string())},
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    // If user exists, return without creating a new one
    if (existingUser) {
      console.log("User already exists:", args.userId);
      return existingUser;
    }

    // Only create if user doesn't exist
    return await ctx.db.insert("users", {
      email: args.email,
      userId: args.userId,
      username: args.username,
      role: args.role ?? 'user'
    });
  }
})

/**
 * Gets the currently authenticated user's data
 * Use this when:
 * - Checking if a user is logged in
 * - Displaying user profile information
 * - Fetching user-specific data on page load
 * Returns undefined if no user is authenticated
 */
export const getUser = query({
  args:{},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return undefined;
    }

    return ctx.db
    .query('users')
    .withIndex('by_userId', (q) => q.eq('userId', user.subject))
    .first()
  },
})

/**
 * Deletes a user and their associated data from the database
 * Use this when:
 * - Implementing account deletion
 * - Handling user removal requests
 * - Cleaning up user data during account termination
 * Note: This is an internal mutation, ensure proper authorization before calling
 */
export const handleUserDeletion = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log("Starting deletion process for userId:", args.userId);

    // Find the user
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .unique();
    // no user found to delete
    if (!user) {
      console.log("No user found to delete");
      return;
    }
    // delete user
    await ctx.db.delete(user._id);
    console.log("User and all related data deleted successfully");
  }
});

/**
 * Retrieves a user's data by their userId
 * Use this when:
 * - Looking up user profiles
 * - Verifying user existence
 * - Fetching user details for administrative purposes like stripe webhooks
 * Note: This is an internal query, meant for server-side operations
 */
export const getUserById = internalQuery({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.id))
      .first();
  },
});

/**
 * Checks if the currently authenticated user has admin access
 * Use this when:
 * - Verifying admin permissions for protected routes
 * - Controlling access to administrative features
 * - Validating boilerplate purchase capabilities
 * - Managing access to premium content and templates
 * Returns false if no user is authenticated or user is not an admin
 */
export const checkAdminAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), identity.subject))
      .unique();
    
    return user?.role === "admin";
  },
});

export const setStripeId = internalMutation({
  args: {stripeId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
    .query('users')
    .withIndex('by_userId', q => q.eq('userId', args.userId))
    .first()

    if (!user) {
      throw new Error("no user found with that user id")
    }

    await ctx.db.patch(user._id, {
      stripeId: args.stripeId,
    })
  }
})
export const getStripeId = internalQuery({
  args: {userId: v.string()},
  handler: async (ctx, args) => {
    const user = await ctx.db
    .query('users')
    .withIndex('by_userId', q => q.eq('userId', args.userId))
    .first()

    if (!user) {
      throw new Error("no user found with that user id")
    }

    return user.stripeId
  }
})

