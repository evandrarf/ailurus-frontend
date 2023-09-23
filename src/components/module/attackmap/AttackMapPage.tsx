import { useUserTeams } from "@/components/fetcher/user";

interface AttackMapPointProps {
  pointId: number;
  pointName: string;
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
  const { posX: defX, posY: defY } = getCoordinates(
    (pointId + 1) % teamLen,
    teamLen
  );

  return (
    <g key={"ent-point-" + pointId}>
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
        text-anchor="middle"
        className="map-entity"
      >
        {pointName}
      </text>
      <line
        x1={posX + pointSize / 2}
        y1={posY + 17}
        x2={defX + pointSize / 2}
        y2={defY + 17}
        stroke="white"
        stroke-width="1mm"
      />
    </g>
  );
}

function AttackMap() {
  const { isLoading, data } = useUserTeams();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const teamData = data?.data;
  const teamLen = teamData?.length ?? 1;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      id="attack-map"
      width="100%"
      height="100%"
      viewBox="0 0 1500 750"
    >
      <g id="entity">
        {teamData?.map((data, idx) => (
          <AttackMapPoint
            pointId={idx}
            pointName={data.name}
            teamLen={teamLen}
          />
        ))}
      </g>
    </svg>
  );
}

export default function AttackMapPage() {
  return (
    <div className="w-full h-full">
      <AttackMap />
    </div>
  );
}
