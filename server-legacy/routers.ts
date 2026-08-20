import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { findNexoraJob, listNexoraJobs } from "./nexoraRepository";
import {
  generateMatchInsight,
  generateMatchInsights,
  interpretSearchIntent,
  matchResumeToJobs,
  summarizeJob,
} from "./nexoraService";

const workModeSchema = z.enum(["remote", "hybrid", "onsite", "any"]);
const jobTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "any",
]);
const senioritySchema = z.enum([
  "intern",
  "entry",
  "mid",
  "senior",
  "lead",
  "any",
]);
const profileSchema = z.object({
  name: z.string().trim().max(120),
  location: z.string().trim().max(120),
  experienceLevel: z.enum(["intern", "entry", "mid", "senior", "lead"]),
  skills: z.array(z.string().trim().min(1).max(64)).max(30),
  preferredRoles: z.array(z.string().trim().min(1).max(80)).max(10),
  preferredLocations: z.array(z.string().trim().min(1).max(120)).max(10),
  workMode: workModeSchema,
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  nexora: router({
    listJobs: publicProcedure
      .input(
        z.object({
          query: z.string().trim().max(200).optional(),
          location: z.string().trim().max(120).optional(),
          skills: z.array(z.string().trim().max(64)).max(10).optional(),
          workMode: workModeSchema.optional(),
          jobType: jobTypeSchema.optional(),
          seniority: senioritySchema.optional(),
          salaryMin: z.number().int().min(0).max(50000000).optional(),
          sort: z.enum(["relevance", "newest", "salary"]).optional(),
        })
      )
      .query(({ input }) => listNexoraJobs(input)),
    getJob: publicProcedure
      .input(z.object({ id: z.string().min(1).max(96) }))
      .query(async ({ input }) => {
        const job = await findNexoraJob(input.id);
        if (!job)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The requested role is no longer available.",
          });
        return job;
      }),
    interpretSearch: publicProcedure
      .input(z.object({ query: z.string().trim().min(3).max(300) }))
      .mutation(({ input }) => interpretSearchIntent(input.query)),
    matchJob: publicProcedure
      .input(
        z.object({ jobId: z.string().min(1).max(96), profile: profileSchema })
      )
      .mutation(async ({ input }) => {
        const job = await findNexoraJob(input.jobId);
        if (!job)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "This role is no longer available.",
          });
        return generateMatchInsight(input.profile, job);
      }),
    matchJobs: publicProcedure
      .input(
        z.object({
          jobIds: z.array(z.string().min(1).max(96)).min(1).max(12),
          profile: profileSchema,
        })
      )
      .mutation(async ({ input }) => {
        const jobs = (
          await Promise.all(input.jobIds.map(id => findNexoraJob(id)))
        ).filter((job): job is NonNullable<typeof job> => Boolean(job));
        const insights = await generateMatchInsights(input.profile, jobs);
        return jobs.map((job, index) => ({
          jobId: job.id,
          insight: insights[index],
        }));
      }),
    matchResume: publicProcedure
      .input(
        z.object({
          resumeText: z.string().trim().min(40).max(20000),
          limit: z.number().int().min(3).max(8).default(6),
        })
      )
      .mutation(async ({ input }) => {
        const jobs = await listNexoraJobs({ sort: "relevance" });
        return matchResumeToJobs(input.resumeText, jobs, input.limit);
      }),
    summarizeJob: publicProcedure
      .input(z.object({ jobId: z.string().min(1).max(96) }))
      .mutation(async ({ input }) => {
        const job = await findNexoraJob(input.jobId);
        if (!job)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "This role is no longer available.",
          });
        return summarizeJob(job);
      }),
  }),
});

export type AppRouter = typeof appRouter;
