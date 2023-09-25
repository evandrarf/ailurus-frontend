import { motion, useAnimation } from "framer-motion";
import { AttackMarker } from "./interface";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { attackMarkerAtom } from "@/components/states";
import { getCoordinates } from "./utils";

interface AttackMarkerPanelProps {
  markerData: AttackMarker[];
  teamLen: number;
}

interface AttackMarkProps {
  attackerId: number;
  defenderId: number;
  color: string;
  teamLen: number;
}

function AttackMarkerLine({
  attackerId,
  defenderId,
  color,
  teamLen,
}: AttackMarkProps) {
  const { posX: attackX, posY: attackY } = getCoordinates(attackerId, teamLen);
  const { posX: defendX, posY: defendY } = getCoordinates(defenderId, teamLen);
  const showMarker = useAnimation();
  var [attackMarker, setAttackMarker] = useAtom(attackMarkerAtom);
  var [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    showMarker.start({
      pathLength: [0, 1],
      transition: { duration: 0.5 },
    });
  }, [showMarker]);

  useEffect(() => {
    if (isDelete) {
      const timeoutId = setTimeout(
        () => setAttackMarker(attackMarker.slice(1)),
        3000
      );

      return () => {
        clearTimeout(timeoutId);
      };
    }
  });

  const marker = (
    <motion.line
      x1={attackX + 50}
      y1={attackY + 17}
      x2={defendX + 50}
      y2={defendY + 17}
      stroke={color}
      strokeWidth="1mm"
      initial={{ pathLength: 0 }}
      animate={showMarker}
      onAnimationComplete={() => setIsDelete(true)}
    />
  );

  return marker;
}

export function AttackMarkerPanel({
  markerData,
  teamLen,
}: AttackMarkerPanelProps) {
  return (
    <g>
      {markerData.map((val, idx) => (
        <AttackMarkerLine
          attackerId={val.attackerId}
          defenderId={val.defenderId}
          color={val.color}
          teamLen={teamLen}
          key={"marker-" + idx}
        />
      ))}
    </g>
  );
}
