export interface MachineClient {
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

// Demo only. In production these live in a secrets manager or identity provider, never in code.
export const MACHINE_CLIENTS: MachineClient[] = [
  { clientId: 'mission-planner', clientSecret: 'dev-secret-1', scopes: ['reservations:read', 'reservations:write'] },
  { clientId: 'ops-dashboard',   clientSecret: 'dev-secret-2', scopes: ['reservations:read'] },
];