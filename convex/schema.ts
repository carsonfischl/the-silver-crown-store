import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    username: v.string(),
    stripeId: v.optional(v.string()),
    role: v.optional(v.string()),
  })
  .index("by_userId", ["userId"])
  .index("by_stripeId", ["stripeId"])
  .index("by_username", ["username"]),

  boilerplates: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    createdAt: v.number(),
    createdBy: v.string(),
  }),
  featureRequests: defineTable({
    userId: v.optional(v.string()),
    username: v.optional(v.string()),
    request: v.string(),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(v.string()),
    status: v.string(),
    adminNote: v.optional(v.string()),
    votes: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_votes", ["votes"])
    .index("by_createdAt", ["createdAt"]),

    items: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        createdAt: v.number(),
        stripeId: v.optional(v.string()),
    })
    .index("by_stripeId", ["stripeId"])
    .index("by_createdAt", ["createdAt"]),
});
