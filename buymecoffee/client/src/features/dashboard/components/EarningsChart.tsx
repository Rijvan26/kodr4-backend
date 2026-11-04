import { useMemo, useState, useRef, useCallback } from "react";
import type { CreatorDashboardPayment } from "../../creator/types/creator.types";

interface EarningsChartProps {
  payments: CreatorDashboardPayment[];
}

type Timeframe = "7D" | "30D" | "All";

export const EarningsChart = ({ payments }: EarningsChartProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("30D");
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredPoint, setHoveredPoint] = useState<{
    key: string;
    dateLabel: string;
    amount: number;
    coffeeCount: number;
    x: number;
    y: number;
  } | null>(null);

  // Filter and aggregate payments by day
  const chartData = useMemo(() => {
    const now = new Date();
    const daysLimit = timeframe === "7D" ? 7 : timeframe === "30D" ? 30 : 90;

    // Create daily slots for the last N days
    const dayMap = new Map<string, { amount: number; count: number; date: Date }>();

    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dayMap.set(key, { amount: 0, count: 0, date: d });
    }

    payments.forEach((payment) => {
      const pDate = new Date(payment.date);
      if (isNaN(pDate.getTime())) return;
      const key = pDate.toISOString().split("T")[0];
      if (dayMap.has(key)) {
        const current = dayMap.get(key)!;
        current.amount += payment.amount || 0;
        current.count += payment.coffeeQuantity || 1;
      } else if (timeframe === "All") {
        dayMap.set(key, {
          amount: (dayMap.get(key)?.amount || 0) + (payment.amount || 0),
          count: (dayMap.get(key)?.count || 0) + (payment.coffeeQuantity || 1),
          date: pDate,
        });
      }
    });

    const points = Array.from(dayMap.entries())
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([key, val]) => ({
        key,
        date: val.date,
        amount: val.amount,
        count: val.count,
        label: val.date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      }));

    const totalInPeriod = points.reduce((acc, p) => acc + p.amount, 0);
    const peakAmount = Math.max(...points.map((p) => p.amount), 0);
    const avgDaily = points.length > 0 ? Math.round(totalInPeriod / points.length) : 0;

    return {
      points,
      totalInPeriod,
      peakAmount,
      avgDaily,
    };
  }, [payments, timeframe]);

  // Compute SVG coordinates (1000 x 280 viewBox)
  const svgWidth = 1000;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 35;
  const paddingTop = 40;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxScale = Math.max(chartData.peakAmount * 1.2, 1000);

  const coordinates = useMemo(() => {
    const len = chartData.points.length;
    if (len === 0) return [];

    return chartData.points.map((pt, idx) => {
      const x = paddingLeft + (idx / Math.max(len - 1, 1)) * chartWidth;
      const y = paddingTop + chartHeight - (pt.amount / maxScale) * chartHeight;
      return { ...pt, x, y };
    });
  }, [chartData.points, maxScale, chartWidth, chartHeight]);

  // Stable hover resolution via X-coordinate projection (eliminates 100% of glitching)
  const resolveClosestPoint = useCallback(
    (clientX: number) => {
      if (!svgRef.current || coordinates.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;

      const relativeX = ((clientX - rect.left) / rect.width) * svgWidth;

      // Find the nearest point by distance along the X-axis
      let closest = coordinates[0];
      let minDistance = Math.abs(relativeX - closest.x);

      for (let i = 1; i < coordinates.length; i++) {
        const dist = Math.abs(relativeX - coordinates[i].x);
        if (dist < minDistance) {
          minDistance = dist;
          closest = coordinates[i];
        }
      }

      setHoveredPoint((prev) => {
        if (prev?.key === closest.key) return prev;
        return {
          key: closest.key,
          dateLabel: closest.label,
          amount: closest.amount,
          coffeeCount: closest.count,
          x: closest.x,
          y: closest.y,
        };
      });
    },
    [coordinates, svgWidth]
  );

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    resolveClosestPoint(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches[0]) {
      resolveClosestPoint(e.touches[0].clientX);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Build curved SVG path
  const linePath = useMemo(() => {
    if (coordinates.length === 0) return "";
    if (coordinates.length === 1) {
      return `M ${paddingLeft},${coordinates[0].y} L ${svgWidth - paddingRight},${coordinates[0].y}`;
    }

    let path = `M ${coordinates[0].x},${coordinates[0].y}`;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const current = coordinates[i];
      const next = coordinates[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
    }
    return path;
  }, [coordinates]);

  const areaPath = useMemo(() => {
    if (!linePath || coordinates.length === 0) return "";
    const baselineY = paddingTop + chartHeight;
    const firstX = coordinates[0].x;
    const lastX = coordinates[coordinates.length - 1].x;
    return `${linePath} L ${lastX},${baselineY} L ${firstX},${baselineY} Z`;
  }, [linePath, coordinates, chartHeight]);

  // Y-axis ticks
  const yTicks = [
    { label: `₹${Math.round(maxScale).toLocaleString("en-IN")}`, y: paddingTop },
    { label: `₹${Math.round(maxScale * 0.66).toLocaleString("en-IN")}`, y: paddingTop + chartHeight * 0.33 },
    { label: `₹${Math.round(maxScale * 0.33).toLocaleString("en-IN")}`, y: paddingTop + chartHeight * 0.66 },
    { label: "₹0", y: paddingTop + chartHeight },
  ];

  // X-axis sample labels (adaptive step for clean layout on any viewport)
  const step = Math.max(1, Math.floor(coordinates.length / 5));
  const xLabels = coordinates.filter(
    (_, idx) => idx % step === 0 || idx === coordinates.length - 1
  );

  return (
    <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-headline-sm text-lg sm:text-headline-sm text-primary font-bold">
              Earnings Overview (₹)
            </h2>
            <span className="px-2.5 py-0.5 bg-tertiary-fixed text-primary rounded-full text-xs font-semibold">
              Real-time
            </span>
          </div>
          <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant pt-0.5">
            Track incoming fan contributions, tips, and supporter coffees.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
          {/* Quick summary chips (visible across devices) */}
          <div className="flex items-center gap-1.5 text-xs sm:text-label-sm font-label-sm">
            <span className="px-2.5 py-1 bg-surface-container-low rounded-full text-on-surface-variant">
              Peak: <strong className="text-primary font-semibold">₹{chartData.peakAmount.toLocaleString("en-IN")}</strong>
            </span>
            <span className="px-2.5 py-1 bg-surface-container-low rounded-full text-on-surface-variant">
              Avg: <strong className="text-primary font-semibold">₹{chartData.avgDaily.toLocaleString("en-IN")}</strong>
            </span>
          </div>

          {/* Timeframe selector */}
          <div className="inline-flex bg-surface-container-high p-0.5 sm:p-1 rounded-full text-xs sm:text-label-sm font-label-sm">
            {(["7D", "30D", "All"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  timeframe === tf
                    ? "bg-primary text-on-primary shadow-xs font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden bg-surface-container-low/40 rounded-2xl p-3 sm:p-5 lg:p-6 border border-outline-variant/20 touch-none">
        {/* Tooltip Overlay (pointer-events-none completely eliminates hover flicker) */}
        {hoveredPoint && (
          <div
            className="absolute z-30 flex flex-col items-start bg-primary text-on-primary px-3 py-1.5 rounded-xl shadow-xl pointer-events-none transition-all duration-75 ease-out select-none"
            style={{
              left: `${Math.min(92, Math.max(8, (hoveredPoint.x / svgWidth) * 100))}%`,
              top: `${Math.max(12, (hoveredPoint.y / svgHeight) * 100)}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="flex items-center gap-1 font-label-sm text-[11px] font-bold text-secondary-container">
              <span>{hoveredPoint.dateLabel}</span>
            </div>
            <div className="font-currency-display text-xs sm:text-sm font-bold whitespace-nowrap">
              ₹{hoveredPoint.amount.toLocaleString("en-IN")}{" "}
              <span className="font-body-sm font-normal text-on-primary/80 text-[11px]">
                ({hoveredPoint.coffeeCount} {hoveredPoint.coffeeCount === 1 ? "coffee" : "coffees"})
              </span>
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          className="w-full h-48 sm:h-64 lg:h-72 overflow-visible cursor-crosshair select-none"
          preserveAspectRatio="none"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#D4E6C3" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FAF6EC" stopOpacity="0.0" />
            </linearGradient>

            {/* Line stroke gradient */}
            <linearGradient id="lineStroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#3B6756" />
              <stop offset="70%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0F3D2E" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <line
              key={i}
              x1={paddingLeft}
              x2={svgWidth - paddingRight}
              y1={tick.y}
              y2={tick.y}
              stroke="#E6E2D8"
              strokeDasharray={i === yTicks.length - 1 ? undefined : "4 6"}
              strokeWidth="1"
            />
          ))}

          {/* Y-axis tick labels */}
          {yTicks.map((tick, i) => (
            <text
              key={i}
              x={paddingLeft - 8}
              y={tick.y + 4}
              textAnchor="end"
              fill="#717974"
              className="text-[11px] font-mono select-none"
            >
              {tick.label}
            </text>
          ))}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

          {/* Curved line stroke */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Vertical guideline for hovered point */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              x2={hoveredPoint.x}
              y1={paddingTop}
              y2={paddingTop + chartHeight}
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="pointer-events-none transition-all duration-75"
            />
          )}

          {/* Data nodes */}
          {coordinates.map((pt, i) => {
            const isHovered = hoveredPoint?.key === pt.key;
            return (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6.5" : pt.amount > 0 ? "4.5" : "2.5"}
                fill={isHovered ? "#FEA619" : pt.amount > 0 ? "#10B981" : "#FAF6EC"}
                stroke="#00261a"
                strokeWidth={isHovered ? "2.5" : pt.amount > 0 ? "2" : "1"}
                className="pointer-events-none transition-all duration-150 ease-out"
              />
            );
          })}

          {/* X-axis labels */}
          {xLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={lbl.x}
              y={paddingTop + chartHeight + 22}
              textAnchor="middle"
              fill="#717974"
              className="text-[11px] font-sans select-none"
            >
              {lbl.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default EarningsChart;
