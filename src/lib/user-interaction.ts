export const SCROLL_EVENTS = ["wheel", "touchstart", "keydown"] as const;
export const INTENT_EVENTS = ["pointerdown", ...SCROLL_EVENTS] as const;
export const INTERACTION_EVENTS = [...INTENT_EVENTS, "pointermove"] as const;

export type InteractionEvent = (typeof INTERACTION_EVENTS)[number];

type Handler = (event: Event) => void;

type Subscription = {
  handler: Handler;
  events: readonly InteractionEvent[];
};

const subscriptions = new Set<Subscription>();
const activeEvents = new Set<InteractionEvent>();
let lastEvent: Event | null = null;

function receives(subscription: Subscription, type: string) {
  return subscription.events.includes(type as InteractionEvent);
}

function dispatch(event: Event) {
  const type = event.type as InteractionEvent;
  if (!INTERACTION_EVENTS.includes(type)) return;

  lastEvent = event;
  for (const subscription of [...subscriptions]) {
    if (receives(subscription, type)) subscription.handler(event);
  }
}

function syncListeners() {
  const required = new Set<InteractionEvent>();
  subscriptions.forEach((subscription) => {
    subscription.events.forEach((event) => required.add(event));
  });

  INTERACTION_EVENTS.forEach((event) => {
    if (required.has(event) && !activeEvents.has(event)) {
      window.addEventListener(event, dispatch, { passive: true });
      activeEvents.add(event);
    } else if (!required.has(event) && activeEvents.has(event)) {
      window.removeEventListener(event, dispatch);
      activeEvents.delete(event);
    }
  });
}

/**
 * Defers optional work until a person actually interacts with the page.
 * Programmatic scrolling and timed audits do not count as interaction.
 */
export function onUserInteraction(
  handler: Handler,
  events: readonly InteractionEvent[] = INTERACTION_EVENTS,
) {
  if (typeof window === "undefined") return () => {};

  const subscription: Subscription = { handler, events };
  subscriptions.add(subscription);
  syncListeners();

  if (lastEvent && receives(subscription, lastEvent.type)) {
    const replay = lastEvent;
    queueMicrotask(() => {
      if (subscriptions.has(subscription)) subscription.handler(replay);
    });
  }

  return () => {
    subscriptions.delete(subscription);
    syncListeners();
  };
}
