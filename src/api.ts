import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AnnouncementCreateInputSchema,
  AnnouncementSchema,
  ChatSchema,
  ProblemSchema,
  SubmissionSchema,
  UserSchema,
} from './prisma/generated/zod';

// TODO: https://github.com/colinhacks/zod/discussions/2171

const contract = initContract();

export const announcementRouter = contract.router(
  {
    getAnnouncements: {
      method: 'GET',
      path: '',
      responses: {
        200: z.array(AnnouncementSchema),
      },
      summary: 'Get all announcements',
    },
    createAnnouncement: {
      method: 'POST',
      path: '',
      body: AnnouncementSchema.pick({ value: true }),
      responses: {
        201: AnnouncementSchema,
        400: z.object({ message: z.string() }),
      },
      summary: 'Create an announcement',
    },
    getContestAnnouncments: {
      method: 'GET',
      path: '/contest/:contestId',
      responses: {
        200: z.array(AnnouncementSchema),
      },
      summary: 'Get contest announcements',
    },
    createContestAnnouncement: {
      method: 'POST',
      path: '/contest/:contestId',
      body: AnnouncementSchema.pick({ value: true }),
      responses: {
        201: AnnouncementSchema,
        400: z.object({ message: z.string() }),
      },
      summary: 'Create an announcement in a contest',
    },
    deleteAnnouncement: {
      method: 'DELETE',
      path: '/:announcementId',
      body: null,
      responses: {
        200: AnnouncementSchema,
      },
      summary: 'Delete an announcement',
    },
    showAnnouncement: {
      method: 'PATCH',
      path: '/:announcementId',
      body: AnnouncementSchema.pick({ show: true }),
      responses: {
        200: AnnouncementSchema,
      },
      summary: 'Toggle show of an announcement',
    },
    updateAnnouncement: {
      method: 'PUT',
      path: '/:announcementId',
      body: AnnouncementCreateInputSchema,
      responses: {
        200: AnnouncementSchema,
      },
      summary: 'Update an announcement',
    },
  },
  { pathPrefix: '/announcement' },
);

const PaginationQuerySchema = z.object({
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const chatRouter = contract.router({
  getChats: {
    method: 'GET',
    path: '/chat',
    responses: {
      200: z.array(ChatSchema),
    },
    query: PaginationQuerySchema,
    summary: 'Get paginated chats',
  },
});

const UserWithourPasswordSchema = UserSchema.pick({
  id: true,
  username: true,
  showName: true,
  role: true,
  rating: true,
});

const SubmissionWithoutSourceCodeSchema = SubmissionSchema.pick({
  id: true,
  result: true,
  score: true,
  timeUsed: true,
  status: true,
  errmsg: true,
  contestId: true,
  language: true,
  creationDate: true,
  public: true,
})
  .merge(
    z.object({
      problem: ProblemSchema.pick({
        id: true,
        name: true,
      }).nullable(),
    }),
  )
  .merge(
    z.object({
      user: UserWithourPasswordSchema.nullable(),
    }),
  );

const SubmissionWithSourceCodeSchema = SubmissionWithoutSourceCodeSchema.merge(
  SubmissionSchema.pick({ sourceCode: true }),
);

export const submissionRouter = contract.router(
  {
    getSubmissions: {
      method: 'GET',
      path: '',
      responses: {
        200: z.array(SubmissionWithoutSourceCodeSchema),
      },
      query: PaginationQuerySchema,
      summary: 'Get paginated submissions',
    },
    getContestSubmissions: {
      method: 'GET',
      path: '/contest',
      responses: {
        200: z.array(SubmissionWithoutSourceCodeSchema),
      },
      query: PaginationQuerySchema,
      summary: 'Get paginated contest submissions',
    },
    getLatestSubmissionByProblemId: {
      method: 'GET',
      path: '/problem/:problemId/latest',
      responses: {
        200: z.object({
          latestSubmission: SubmissionWithSourceCodeSchema.nullable(),
        }),
      },
      summary: 'Get latest submission for a problem',
    },
    uploadFile: {
      method: 'POST',
      path: '/problem/:problemId',
      responses: {
        200: SubmissionSchema,
      },
      body: SubmissionSchema.pick({
        language: true,
        contestId: true,
      }),
      summary: 'Submit code file',
    },
    getLatestSubmissionByUserId: {
      method: 'GET',
      path: '/latest',
      responses: {
        200: z.object({
          latestSubmission: SubmissionWithSourceCodeSchema.nullable(),
        }),
      },
      summary: 'Get latest submission for a user',
    },
    getSubmissionsByUserId: {
      method: 'GET',
      path: '/user/:userId',
      responses: {
        200: z.array(SubmissionWithoutSourceCodeSchema),
        400: z.object({ message: z.string() }),
      },
      query: PaginationQuerySchema,
      summary: 'Get submissions for a user',
    },
    getSubmission: {
      method: 'GET',
      path: '/:submissionId',
      responses: {
        200: SubmissionWithoutSourceCodeSchema,
        404: z.object({ message: z.string() }),
      },
      summary: 'Get a submission without source code',
    },
    getSubmissionWithSourceCode: {
      method: 'GET',
      path: '/:submissionId/code',
      responses: {
        200: SubmissionWithSourceCodeSchema,
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
      summary: 'Get a submission with source code',
    },
    shareSubmission: {
      method: 'PATCH',
      path: '/:submissionId/share',
      responses: {
        200: SubmissionSchema.pick({ public: true }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
      body: z.object({ show: z.boolean() }),
      summary: 'Toggle publicity of a submission',
    },
    rejudgeSubmission: {
      method: 'PATCH',
      path: '/:submissionId/rejudge',
      responses: {
        200: SubmissionWithoutSourceCodeSchema,
        404: z.object({ message: z.string() }),
      },
      body: z.undefined(),
    },
    rejudgeProblem: {
      method: 'PATCH',
      path: '/problem/:problemId/rejudge',
      responses: {
        200: z.undefined(),
        404: z.object({ message: z.string() }),
      },
      body: z.undefined(),
    },
  },
  { pathPrefix: '/submission' },
);

export const router = contract.router({
  announcement: announcementRouter,
  chat: chatRouter,
  submission: submissionRouter,
});
