import { z } from 'zod';

export const zString = z.string();

export const IdMessage = z.object({
  type: z.string(),
  id: z.string(),
});

export const Message = z.object({
  type: z.string(),
  message: z.string(),
});

export const OpponentInfoMessage = z.object({
  type: z.string(),
  opponentId: z.string(),
});

export const TurnMessage = z.object({
  type: z.string(),
  turn: z.string(),
});

export const PlayerFiredMessage = z.object({
  type: z.string(),
  position: z.object({
    y: z.number(),
    x: z.number(),
  }),
});

export const AnnounceWinnerMessage = z.object({
  type: z.string(),
  winner: z.string(),
  loser: z.string(),
});

export type IdMessageType = z.infer<typeof IdMessage>;
export type MessageType = z.infer<typeof Message>;
export type OpponentInfoMessageType = z.infer<typeof OpponentInfoMessage>;
export type TurnMessageType = z.infer<typeof TurnMessage>;
export type PlayerFiredMessageType = z.infer<typeof PlayerFiredMessage>;
export type AnnounceWinnerMessageType = z.infer<typeof AnnounceWinnerMessage>;