import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AnnouncementCreateInputSchema,
  AnnouncementSchema,
  ChatSchema,
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

export const chatRouter = contract.router({
  getChats: {
    method: 'GET',
    path: '/chat',
    responses: {
      200: z.array(ChatSchema),
    },
    query: z.object({
      offset: z.string().pipe(z.coerce.number()).optional(),
      limit: z.string().pipe(z.coerce.number()).optional(),
    }),
    summary: 'Get paginated chats',
  },
});

export const router = contract.router({
  announcement: announcementRouter,
  chat: chatRouter,
});
