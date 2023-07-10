import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AnnouncementCreateInputSchema,
  AnnouncementSchema,
} from './prisma/generated/zod';

// TODO: https://github.com/colinhacks/zod/discussions/2171

const contract = initContract();

export const apiAnnouncement = contract.router({
  getAllAnnouncement: {
    method: 'GET',
    path: '/',
    responses: {
      200: z.array(AnnouncementSchema),
    },
    summary: 'Get all shown announcements',
  },
  createAnnouncement: {
    method: 'POST',
    path: '/',
    responses: {
      201: AnnouncementSchema,
    },
    body: AnnouncementCreateInputSchema,
    summary: 'Create a post',
  },
});

export const router = contract.router({
  announcement: apiAnnouncement,
});
