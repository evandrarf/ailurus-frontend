import { ArrowRight } from "@phosphor-icons/react";
import React, { useState, useRef } from "react";
import { AttackLog } from "./interface";

export interface AttackLogWindowProps {
  attackLogs: AttackLog[];
}

export interface AttackLogRowProps {
  attacker: string;
  defender: string;
  index: number;
}

function AttackLogRow({ attacker, defender, index }: AttackLogRowProps) {
  return (
    <div>
      {index > 0 && <div className="divider my-0 w-full"></div>}
      <div className="grid grid-cols-3 text-center p-2">
        <pre>
          <code>{attacker}</code>
        </pre>
        <div className="justify-center flex">
          <ArrowRight size={24} />
        </div>
        <pre>
          <code>{defender}</code>
        </pre>
      </div>
    </div>
  );
}

const AttackLogWindow = ({ attackLogs }: AttackLogWindowProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setIsDragging(true);
    setOffsetX(e.clientX - e.currentTarget.getBoundingClientRect().left);
    setOffsetY(e.clientY - e.currentTarget.getBoundingClientRect().top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    e.currentTarget.style.left = x + "px";
    e.currentTarget.style.top = y + "px";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={"fixed rounded-md shadow-lg block w-3/12"}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex justify-between py-1 px-2 bg-neutral-focus">
        <h2 className="font-semibold">Attack Logs</h2>
      </div>
      <div
        className="py-2 bg-neutral-focus max-h-96 max-w-96 overflow-auto"
        style={{ opacity: 0.35 }}
      >
        {attackLogs.map((row, index) => (
          <AttackLogRow
            attacker={row.attacker.name}
            defender={row.defender.name}
            index={index}
            key={`attack-log-row-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AttackLogWindow;
