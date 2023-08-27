import { ServerMode } from "@/types/common";
import { Team } from "@/types/team";

export interface TeamProps<TServerMode extends ServerMode> {
  team: Team<TServerMode>;
}
