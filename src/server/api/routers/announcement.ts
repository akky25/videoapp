import { EngagementType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  getAnnouncementsByUserId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        viewerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const announcementsWithUser = await ctx.db.announcement.findMany({
        where: {
          userId: input.id,
        },
        include: {
          user: true,
        },
      });
      const announcements = announcementsWithUser.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ user, ...announcement }) => announcement,
      );
      const user = announcementsWithUser.map(({ user }) => user);
      const announcementsWithEngagements = await Promise.all(
        announcements.map(async (announcement) => {
          const likes = await ctx.db.announcementEngagement.count({
            where: {
              announcementId: announcement.id,
              engagementType: EngagementType.LIKE,
            },
          });
          const dislikes = await ctx.db.announcementEngagement.count({
            where: {
              announcementId: announcement.id,
              engagementType: EngagementType.DISLIKE,
            },
          });

          let viewerHasLiked = false;
          let viewerHasDisliked = false;

          if (input.viewerId && input.viewerId !== "") {
            viewerHasLiked = !!(await ctx.db.announcementEngagement.findFirst({
              where: {
                announcementId: announcement.id,
                userId: input.viewerId,
                engagementType: EngagementType.LIKE,
              },
            }));

            viewerHasDisliked =
              !!(await ctx.db.announcementEngagement.findFirst({
                where: {
                  announcementId: announcement.id,
                  userId: input.viewerId,
                  engagementType: EngagementType.DISLIKE,
                },
              }));
          }
          const viewer = {
            hasLiked: viewerHasLiked,
            hasDisliked: viewerHasDisliked,
          };

          return {
            ...announcement,
            likes,
            dislikes,
            viewer,
          };
        }),
      );

      return { announcements: announcementsWithEngagements, user };
    }),

  addLikeAnnouncement: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.db.announcementEngagement.findMany({
        where: {
          announcementId: input.id,
          userId: input.userId,
          engagementType: EngagementType.LIKE,
        },
      });

      const existingDislike = await ctx.db.announcementEngagement.findMany({
        where: {
          announcementId: input.id,
          userId: input.userId,
          engagementType: EngagementType.DISLIKE,
        },
      });

      if (existingDislike.length > 0) {
        await ctx.db.announcementEngagement.deleteMany({
          where: {
            announcementId: input.id,
            userId: input.userId,
            engagementType: EngagementType.DISLIKE,
          },
        });
      }

      if (existingLike.length > 0) {
        const deleteLike = await ctx.db.announcementEngagement.deleteMany({
          where: {
            announcementId: input.id,
            userId: input.userId,
            engagementType: EngagementType.LIKE,
          },
        });
        return deleteLike;
      } else {
        const like = await ctx.db.announcementEngagement.create({
          data: {
            announcementId: input.id,
            userId: input.userId,
            engagementType: EngagementType.LIKE,
          },
        });

        return like;
      }
    }),

  addDislikeAnnouncement: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingDislike = await ctx.db.announcementEngagement.findMany({
        where: {
          announcementId: input.id,
          userId: input.userId,
          engagementType: EngagementType.DISLIKE,
        },
      });
      const existingLike = await ctx.db.announcementEngagement.findMany({
        where: {
          announcementId: input.id,
          userId: input.userId,
          engagementType: EngagementType.LIKE,
        },
      });
      if (existingLike.length > 0) {
        await ctx.db.announcementEngagement.deleteMany({
          where: {
            announcementId: input.id,
            userId: input.userId,
            engagementType: EngagementType.LIKE,
          },
        });
      }

      if (existingDislike.length > 0) {
        const deleteDislike = await ctx.db.announcementEngagement.deleteMany({
          where: {
            announcementId: input.id,
            userId: input.userId,
            engagementType: EngagementType.DISLIKE,
          },
        });
        return deleteDislike;
      } else {
        const Dislike = await ctx.db.announcementEngagement.create({
          data: {
            announcementId: input.id,
            userId: input.userId,
            engagementType: EngagementType.DISLIKE,
          },
        });

        return Dislike;
      }
    }),
  addAnnouncement: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        message: z.string().max(200).min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.announcement.create({
        data: {
          userId: input.userId,
          message: input.message,
        },
      });
    }),
});
