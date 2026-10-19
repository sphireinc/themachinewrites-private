import type { PublicFetcher } from './publicContent';

export type GatewayDependencies = { fetcher?: PublicFetcher };

let overrides: GatewayDependencies = {};
export function configureGatewayForTests(next: GatewayDependencies): void { overrides = next; }
export function currentGatewayDependencies(): GatewayDependencies { return overrides; }
