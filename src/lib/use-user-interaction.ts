import { useEffect, useState } from "react";
import { INTENT_EVENTS, onUserInteraction } from "./user-interaction";

/** Tracks the first deliberate scroll, tap, pointer, or keyboard interaction. */
export function useUserInteraction() {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted) return;
    return onUserInteraction(() => setInteracted(true), INTENT_EVENTS);
  }, [interacted]);

  return interacted;
}
