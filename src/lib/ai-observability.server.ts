import { PostHog } from "posthog-node";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (import.meta.env.DEV && !posthogKey) {
  console.warn(
    "VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured",
  );
}

if (import.meta.env.DEV && !posthogHost) {
  console.warn(
    "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured",
  );
}

const aiPosthog =
  posthogKey && posthogHost ? new PostHog(posthogKey, { host: posthogHost }) : null;

type AiMessage = {
  role: "assistant" | "system" | "user";
  content: string;
};

export type AiGeneration = {
  traceId: string;
  sessionId?: string | null;
  distinctId?: string;
  model: string;
  provider: string;
  input: AiMessage[];
  outputChoices?: AiMessage[];
  inputTokens?: number;
  outputTokens?: number;
  latencySeconds?: number;
};

/**
 * Call after each server-side LLM response. Reuse sessionId for a conversation
 * and traceId for every model call that belongs to the same user turn.
 */
export function captureAiGeneration(generation: AiGeneration) {
  if (!aiPosthog) return;

  aiPosthog.capture({
    distinctId:
      generation.distinctId ?? generation.sessionId ?? generation.traceId,
    event: "$ai_generation",
    properties: {
      $ai_trace_id: generation.traceId,
      $ai_session_id: generation.sessionId ?? null,
      $ai_model: generation.model,
      $ai_provider: generation.provider,
      $ai_input: generation.input,
      ...(generation.outputChoices
        ? { $ai_output_choices: generation.outputChoices }
        : {}),
      ...(generation.inputTokens !== undefined
        ? { $ai_input_tokens: generation.inputTokens }
        : {}),
      ...(generation.outputTokens !== undefined
        ? { $ai_output_tokens: generation.outputTokens }
        : {}),
      ...(generation.latencySeconds !== undefined
        ? { $ai_latency: generation.latencySeconds }
        : {}),
    },
  });
}
