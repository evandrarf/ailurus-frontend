import { ExtendOnServerMode, ServerMode } from "./common";

export type Challenge<TServerMode extends ServerMode> = ExtendOnServerMode<
  {
    id: number;
    name: string;
    description: string;
    num_expose: number;
  },
  TServerMode,
  "share",
  {
    server_id: number;
    server_host: string;
  }
>;

export type ChallengeDetail<TServerMode extends ServerMode> =
  Challenge<TServerMode> & {
    visibility: number[];
    config_status: boolean;
  };
