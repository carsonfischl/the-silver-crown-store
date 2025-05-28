import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

export const create Item = runMutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        createdAt: v.number(),
        stripeId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const item = await ctx.db.insert("items", {
            name: args.name,
            description: args.description,
            price: args.price,
            createdAt: args.createdAt,
            stripeId: args.stripeId,
        });
        return item;
    }
});