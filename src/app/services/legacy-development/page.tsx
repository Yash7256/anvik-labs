import { useEffect } from "react";

export default function LegacyDevelopmentPage() {
  useEffect(() => {
    window.location.replace("/services/development");
  }, []);

  return null;
}
