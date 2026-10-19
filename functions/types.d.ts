interface Env {
  PUBLIC_CONTENT_OWNER?: string;
  PUBLIC_CONTENT_REPO?: string;
  PUBLIC_CONTENT_BRANCH?: string;
  PUBLIC_CONTENT_ORIGIN?: string;
  FEED_CACHE_SECONDS?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params?: Record<string,string | string[] | undefined>;
  next: () => Promise<Response>;
}

type PagesFunction = (context: PagesContext) => Response | Promise<Response>;
