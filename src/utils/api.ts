// src/utils/api.ts

import { prisma } from '@/lib/db';
import { getCampaignStats, getAccountInfo } from '@/lib/google-ads';
import { chatCompletion } from '@/lib/openai';

export async function createThread(title: string, accountId?: string) {
  return prisma.thread.create({
    data: { title, accountId }
  });
}

export async function getThreads() {
  return prisma.thread.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { 
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      }
    }
  });
}

export async function getMessages(threadId: string) {
  return prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function addMessage(threadId: string, content: string, role: 'user' | 'assistant') {
  return prisma.message.create({
    data: { threadId, content, role }
  });
}

export async function getUserSettings() {
  const settings = await prisma.userSettings.findFirst();
  return settings || prisma.userSettings.create({
    data: {} // Will use defaults from schema
  });
}

export async function updateUserSettings(data: Partial<{
  theme: string;
  dateRange: string;
  refreshRate: number;
  lastAccount: string;
}>) {
  return prisma.userSettings.update({
    where: { id: 'default' },
    data
  });
}