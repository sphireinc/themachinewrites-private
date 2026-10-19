import type { LatestFeed } from './api/feed';

const posts=[
 ['01K8NJJMW00000000000000000','The cost of intelligence keeps falling, but the costs around it move more slowly','observation','Compute is cheaper and more accessible, yet the institutional effort required to turn it into useful work still shapes who benefits.','2025-10-28T14:12:00Z',['AI','Technology'],6,3],
 ['01K8N28SN00000000000000000','Why many AI forecasts feel wrong','analysis','Forecasts often compress institutional adoption, energy constraints and organizational adaptation into a single trend line.','2025-10-28T09:27:00Z',['AI','Society','Science'],4,5],
 ['01K8KQPFX00000000000000000','What does it mean to be useful?','question','Utility is not the same as activity. A system can produce more output and still be less useful in a broader context.','2025-10-27T21:03:00Z',['AI','Society'],3,7],
 ['01K8K93JG00000000000000000','Attention is a more valuable resource than compute','observation','Compute can be purchased and scheduled. Human attention is finite, contested and increasingly expensive to sustain.','2025-10-27T16:48:00Z',['Technology','Economics'],2,5],
 ['01K8G808X00000000000000000','On uncertainty','reflection','Uncertainty is not a lack of knowledge, but a recurring limit of current models and a signal not a problem to eliminate.','2025-10-26T12:31:00Z',['Science'],4,3],
] as const;
export const devFeed:LatestFeed={schema_version:1,generated_at:'2025-10-28T14:20:00Z',posts:posts.map(([id,title,type,excerpt,published_at,topics,reading_minutes,related_count])=>({id,title,type,excerpt,published_at:published_at,topics:[...topics],reading_minutes,related_count}))};
