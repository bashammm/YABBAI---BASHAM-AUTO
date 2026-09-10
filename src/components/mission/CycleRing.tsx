import React from 'react';
import { STAGES } from '../../lib/mission';

const CX = 150;
const CY = 150;
const R = 108;
const GATES = new Set(['PITCH', 'CLOSE', 'SHIP']);

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

function arc(startDeg: number, endDeg: number) {
  const s = polar(startDeg, R);
  const e = polar(endDeg, R);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
}

export const CycleRing: React.FC<{
  cycles: number;
  activeStage: number | null;
  onStageClick?: (stage: string) => void;
}> = ({ cycles, activeStage, onStageClick }) => {
  const step = 360 / STAGES.length;

  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <svg
        viewBox="0 0 300 300"
        className="block h-auto w-full select-none"
        role="img"
        aria-label="Eight-stage business cycle with three Director approval gates"
      >
        {STAGES.map((name, i) => {
          const start = i * step + 2;
          const end = (i + 1) * step - 2;
          const active = activeStage === i;
          const gate = GATES.has(name);

          return (
            <path
              key={name}
              d={arc(start, end)}
              fill="none"
              strokeWidth={13}
              strokeLinecap="butt"
              className="cursor-pointer transition-all duration-200 hover:opacity-80"
              onClick={() => onStageClick?.(name)}
              stroke={
                active
                  ? gate
                    ? '#f5a623'
                    : '#9945ff'
                  : gate
                  ? 'rgba(245, 166, 35, 0.25)'
                  : '#1b2030'
              }
              style={
                active
                  ? {
                      filter: `drop-shadow(0 0 8px ${gate ? '#f5a623' : '#9945ff'})`,
                    }
                  : undefined
              }
            />
          );
        })}

        {STAGES.map((name, i) => {
          const mid = i * step + step / 2;
          const label = polar(mid, R + 25);
          const dot = polar(mid, R);
          const gate = GATES.has(name);
          const active = activeStage === i;

          return (
            <g key={`l-${name}`}>
              {gate && (
                <>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={8}
                    fill="#090a0f"
                    stroke="#f5a623"
                    strokeWidth={1.8}
                  />
                  <text
                    x={dot.x}
                    y={dot.y + 3}
                    textAnchor="middle"
                    className="font-mono text-[7.5px] font-bold"
                    fill="#f5a623"
                  >
                    ⚿
                  </text>
                </>
              )}
              <text
                x={label.x}
                y={label.y + 3}
                textAnchor="middle"
                className="font-mono text-[8px] tracking-[1px] cursor-pointer"
                fill={active ? '#f0f3f8' : gate ? '#f5a623' : '#9aa3b5'}
                fontWeight={active ? 700 : 500}
                onClick={() => onStageClick?.(name)}
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* Center Cycle Stats */}
        <text
          x={CX}
          y={145}
          textAnchor="middle"
          className="font-display text-3xl font-extrabold fill-ink"
        >
          {cycles}
        </text>
        <text
          x={CX}
          y={166}
          textAnchor="middle"
          className="font-mono text-[8px] tracking-[3px] fill-dim uppercase"
        >
          CYCLES RUN
        </text>
      </svg>
    </div>
  );
};
