import { z } from 'zod';

export const zString = z.string();

export const IdMessage = z.object({
  type: z.string(),
  message: z.string(),
});

export const Message = z.object({
  type: z.string(),
  message: z.string(),
});

export const OpponentInfoMessage = z.object({
  type: z.string(),
  message: z.string(),
});

export const TurnMessage = z.object({
  type: z.string(),
  message: z.string(),
});

export type IdMessageType = z.infer<typeof IdMessage>;
export type MessageType = z.infer<typeof Message>;
export type OpponentInfoMessageType = z.infer<typeof OpponentInfoMessage>;
export type TurnMessageType = z.infer<typeof TurnMessage>;