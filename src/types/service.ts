type ChallengeKey = string;
type Address = string;
type TeamKey = number;
export type ServiceList = Record<ChallengeKey, Record<TeamKey, Address[]>>;

// Same thing as enum, but I don't want runtime code
type Faulty = 0;
type Valid = 1;
export type ServerState = Faulty | Valid;

export interface ServiceMeta {
  log: string;
  meta: string;
}
