# Public content origin and future mirror threshold

GitHub raw content is the canonical read origin for the MVP. Cloudflare Pages Functions read only the configured public repository branch; public Git remains the publication authority.

The Cloudflare Cache API is data-center local. A warm response in one location does not guarantee a warm response globally. Mutable indexes (`feed/latest.json`, catalog, stats, relations, monthly feeds) use a short `FEED_CACHE_SECONDS` TTL, normally 60 seconds. Canonical post responses are immutable and may be cached much longer by ULID.

## Optional mirror switch threshold

R2 or Workers Assets are not MVP dependencies. Evaluate a mirror only if measurement over a representative week shows **any two** of:

- raw GitHub origin failures or rate limits affect more than 1% of cache-miss requests;
- cold-miss p95 exceeds 2 seconds in two or more regions;
- sustained origin traffic exceeds the GitHub plan's documented quota/budget or creates recurring operational alerts;
- a required recovery objective cannot be met with short-TTL cache plus explicit 503 degradation.

The mirror proposal must define versioned content synchronization, failover/failback, integrity verification, cache-key compatibility and a rollback path. Until then, cold miss during an origin outage returns a retryable error rather than fabricating an empty publication feed.
