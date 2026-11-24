import { isRouteErrorResponse, useRouteError, type MetaFunction } from "react-router";
import NotFoundPage from "@/components/NotFoundPage";

export const meta: MetaFunction = () => [
  { title: "Page not found | Anvik Labs" },
  { name: "robots", content: "noindex" },
];

export default function NotFoundRoute() {
  return <NotFoundPage />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return <NotFoundPage title={isNotFound ? "Page not found" : "Something went wrong"} />;
}
