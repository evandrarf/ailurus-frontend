import { socketio } from "@/components/fetcher/socket";
import { useEffect, useState } from "react";
import AttackLogWindow from "./AttackLogWindow";
import { AttackLog } from "./interface";
import AttackMapPanel from "./AttackMapPanel";

export default function AttackMapPage() {
  var [attackLog, setAttackLog] = useState<AttackLog[]>([]);

  useEffect(() => {
    socketio.on("attack-event", (data: AttackLog) => {
      setAttackLog((prevLog) => [data, ...prevLog]);
    });
    return () => {
      socketio.off("attack-event");
    };
  }, [socketio]);

  return (
    <div className="w-full h-full">
      <AttackLogWindow attackLogs={attackLog} />
      <AttackMapPanel />
    </div>
  );
}
