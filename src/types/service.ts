type ChallengeKey = string;
type Address = string;
type TeamKey = number;
export type ServiceList = Record<ChallengeKey, Record<TeamKey, Address[]>>;
