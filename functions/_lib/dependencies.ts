import type { PublicFetcher } from './publicContent';
import type { EdgeCache } from './cache';

export type GatewayDependencies = { fetcher?: PublicFetcher; cache?: EdgeCache };

let overrides: GatewayDependencies = {};
export function configureGatewayForTests(next: GatewayDependencies): void { overrides = next; }
export function currentGatewayDependencies(): GatewayDependencies { return overrides; }
