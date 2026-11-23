import posthog from "./posthog.client";

type LogAttributes = Record<string, boolean | number | string>;

export const contactDeliveryLogger = {
  info(message: string, attributes: LogAttributes) {
    posthog.logger.info(message, attributes);
  },
  warn(message: string, attributes: LogAttributes) {
    posthog.logger.warn(message, attributes);
  },
};
