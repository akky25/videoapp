import { createTRPCRouter } from "~/server/api/trpc";
import { videoRouter } from "./routers/video";
import { videoEngagementRouter } from "./routers/videoEngagement";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  video: videoRouter,
  videoEngagement: videoEngagementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
