# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - This project has no LLM SDK or LLM call site yet, so the capture helper is wired but cannot be triggered or confirmed until a server-side LLM call is added.

## Status

**Wired and dependency-verified; live capture unverified.** The project is a React Router/Vite site with no vendor LLM SDK, no model-generation call, no conversation identifier, no authenticated user identifier at a call site, and no tool-dispatch loop. The manual-capture AI Observability workflow was selected because there is no provider or framework integration to wrap.

## Changes made

- Declared and installed `posthog-node` version `^6.0.0` for server-side AI Observability capture, synchronizing the lockfile.
- Configured the existing public environment variable names in the local `.env` file: `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`. The committed `.env.example` already documents these keys and was not changed.
- Added `src/lib/ai-observability.server.ts`, an additive server-only helper that:
  - creates a `posthog-node` client only when both existing environment values are configured;
  - warns in development when either value is missing and remains a production no-op when configuration is absent;
  - sends `$ai_generation` events with model, provider, input/output, token counts, latency, trace, and session metadata;
  - keeps one `sessionId` for a conversation and requires callers to supply one `traceId` per user turn, so several model calls in that turn can share a trace;
  - accepts an optional stable `distinctId` without adding any identify calls or user-action captures.
- Wrote the AI setup metadata record at `.posthog-wizard-cache/.posthog-ai.json`.

No existing PostHog initialization, identify logic, event capture, or dashboards were changed.

## Use the helper when an LLM call is added

After receiving a server-side model response, call `captureAiGeneration()` from `src/lib/ai-observability.server.ts`. Supply the model provider's real name, model name, prompt/response messages, token usage when available, and elapsed seconds. Reuse the same `sessionId` for every turn in one conversation, and reuse a single `traceId` for every generation or tool operation belonging to that one turn.

The current project has no server route, script, or test that makes an LLM request, so there is no safe request path to run for end-to-end validation.

## Verification

- Confirmed both configured PostHog environment keys are present locally.
- Installed the declared dependency with `npm install`.
- Ran `npm run typecheck` successfully.
- Ran `npm run build` successfully.
- Ran `npm run lint` successfully.

Once a real LLM call exists, trigger one conversation with two turns and inspect the newest trace in PostHog AI Observability: both turns should be in one session, each turn should have its own trace, and every generation within a turn should share that trace.

## Privacy mode

This is manual capture, so prompt and completion content are included only because `src/lib/ai-observability.server.ts` passes them as `$ai_input` and `$ai_output_choices`. No SDK-wide privacy-mode setting or per-request override applies to this helper.

Before sending prompts or completions whose content must not be stored in PostHog, remove those two properties from the helper call (or avoid calling the helper for that generation) before the event is captured. This does not remove other metadata, custom properties, or events already stored. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
