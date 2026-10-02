import { defineEntity, p } from "@mikro-orm/core";

export const User = defineEntity({
  name: "User",
  properties: {
    id: p.integer().primary().autoincrement(),
    email: p.string().unique(),
    name: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});