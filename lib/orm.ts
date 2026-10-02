import { MikroORM } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config";
import { env } from "./env";

const globalForOrm = globalThis as unknown as {
  orm: MikroORM | undefined;
};

export const orm =
  globalForOrm.orm ??
  (await MikroORM.init(config));

if (env.NODE_ENV !== "production") {
  globalForOrm.orm = orm;
}