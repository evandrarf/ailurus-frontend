export interface AttackLogEntity {
  id: number;
  name: string;
}

export interface AttackLog {
  attacker: AttackLogEntity;
  defender: AttackLogEntity;
}
