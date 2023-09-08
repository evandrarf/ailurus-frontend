type EventState =
  | {
      state: "not started";
    }
  | {
      state: "finished";
    }
  | {
      state: "running";
      current_round: number;
      current_tick: number;
    };

export interface ContestInfo {
  event_name: string;
  event_status: EventState;
  start_time: string;
  number_round: number;
  number_tick: number;
  tick_duration: number;
  logo_url: string;
}
