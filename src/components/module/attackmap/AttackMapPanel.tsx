import { ServerMode } from "@/types/common";
import { Team } from "@/types/team";
import { motion, useAnimation } from "framer-motion";
import { AttackMarker } from "./interface";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { attackMarkerAtom } from "@/components/states";
import { randomColor } from "@/components/utils";

interface AttackMapPanelProps {
  teamData?: Team<ServerMode>[];
}

interface AttackMarkerPanelProps {
  markerData: AttackMarker[];
  teamLen: number;
}

interface AttackMapPointProps {
  pointId: number;
  pointName: string;
  teamLen: number;
}

interface AttackMarkProps {
  attackerId: number;
  defenderId: number;
  color: string;
  teamLen: number;
}

function getCoordinates(pointId: number, teamLen: number) {
  const numX = Math.ceil(Math.sqrt(teamLen));
  const numY = Math.ceil(teamLen / numX);

  const sizeX = 1100 / numX;
  const sizeY = 650 / numY;

  const rowNum = Math.floor(pointId / numX);
  const posY = 150 + rowNum * sizeY;
  var posX = 100 + (pointId % numX) * sizeX;
  if (rowNum % 2 == 1) {
    posX += sizeX / 2;
  }
  return { posX, posY };
}

function AttackMapPoint({ pointId, pointName, teamLen }: AttackMapPointProps) {
  const pointSize = 100;
  const labelGapSize = 30;
  const { posX, posY } = getCoordinates(pointId, teamLen);

  return (
    <g>
      <image
        href={"/entity-team.png"}
        width={pointSize}
        height={pointSize}
        x={posX}
        y={posY}
      ></image>
      <text
        x={posX + pointSize / 2}
        y={posY + pointSize + labelGapSize}
        textAnchor="middle"
        className="map-entity"
      >
        {pointName}
      </text>
    </g>
  );
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
  console.log(markerData);
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

export function AttackMapPanel({ teamData }: AttackMapPanelProps) {
  const teamLen = teamData?.length ?? 1;

  return (
    <g id="entity">
      {teamData?.map((data, idx) => (
        <AttackMapPoint
          pointId={idx}
          pointName={data.name}
          teamLen={teamLen}
          key={"ent-point-" + idx}
        />
      ))}
    </g>
  );
}
