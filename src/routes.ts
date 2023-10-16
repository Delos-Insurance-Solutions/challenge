import { Application } from "express";
import testRouter from "./test/routes";
import quotesRouter from "./quotes/routes";

export const routesConfig = (app: Application) => {
  app.use("/test", testRouter);
  app.use("/quotes", quotesRouter);
};
