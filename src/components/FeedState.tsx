import type { ReactNode } from 'react';

export function FeedError({ message, onRetry }: { message: string; onRetry?: () => void }): ReactNode {
  return <div className="feed-error" role="alert"><p>{message}</p>{onRetry && <button type="button" onClick={onRetry}>Try again</button>}</div>;
}
