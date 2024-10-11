import { z } from "zod";

export const gameParams = z
  .object({
    level: z
      .number()
      .nonnegative()
      .int()
      .min(1)
      .max(2)
      .describe("game difficulty"),
  })
  .describe("to be confirmed for each game, should be provided by CIMU");
export type GameParams = z.infer<typeof gameParams>;

export const streamMatchMessage = z
  .discriminatedUnion("kind", [
    z.object({
      kind: z.literal("[game]:is-ready"),
    }),
    z.object({
      kind: z.literal("[host]:initial-params"),
      userId: z.string().uuid("unique userId"),
      sessionId: z.string().describe("unique for each game session"),
      gameDurationInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe("the duration of the game in seconds"),
      gameParams,
    }),
    z.object({
      kind: z.literal("[host]:start-game"),
      timeLeftInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe(
          "how many seconds left before the game will end, should be 0 <= timeLeft <= gameDurationInSeconds",
        ),
    }),
    z.object({
      kind: z.literal("[game]:ended"),
      scores: z.number().nonnegative().int(),
      pairs: z.number().nonnegative().int(),
      mistakes: z.number().nonnegative().int(),
      elapsedTimeInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe(
          "Number of seconds elapsed since player stared the game until end or player finished it, should be 0 <= elapsed <= timeLeft",
        ),
    }),
  ])
  .and(
    z.object({
      version: z
        .literal(1)
        .describe(
          "this is to make sure our code knows how to handle if schema updated",
        ),
    }),
  );
export type StreamMatchMessage = z.infer<typeof streamMatchMessage>;
export const experience = z.literal("STREAM_MATCH");
export type Experience = z.infer<typeof experience>;

export const metadata = {
  url: "https://stream.342games.com",
  name: "Stream Match",
  shortDescription: "Match the pairs as fast as you can",

  // will be sanitized
  descriptionInHtml:
    "A 3x4 board of cards will be displayed face down. Fans will have to memorize and try their best to match the hidden pairs on the board as fast as possible before the time runs out.",
  launchInstructionInHtml:
    "Normal mode: Each pair is accompanied with a distinct background color to aid with visual memory<br/>Hard mode: Each pair has the same background color, making it more challenging for fans",
  scoringRulesInHtml:
    "Fans are scored based on speed and accuracy. They get 250 Base Points for passing and 500 Bonus for making into Top 100.",
} as const;
