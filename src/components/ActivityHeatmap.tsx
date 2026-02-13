import { useState } from 'react';
import dayjs from 'dayjs';
import { getYearActivity, getMonthLabels } from '../utils/activityTracker';

const LEVEL_COLORS = [
    'bg-gray-100',          // 0 — no activity
    'bg-emerald-200',       // 1 — attempted
    'bg-emerald-400',       // 2 — tried hard
    'bg-emerald-500',       // 3 — won
    'bg-emerald-700',       // 4 — perfect (first try)
];

const LEVEL_LABELS = [
    'No activity',
    'Attempted',
    'Tried hard',
    'Solved',
    'Perfect solve',
];

const ActivityHeatmap = () => {
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const yearData = getYearActivity();
    const monthLabels = getMonthLabels();

    // Build the grid: 7 rows (Sun–Sat) × 53 columns (weeks)
    // GitHub style: each column is a week, rows are days of the week
    const weeks: typeof yearData[number][][] = [];
    let currentWeek: typeof yearData[number][] = [];

    // Pad the start so the first day lands on the correct weekday
    const firstDayOfWeek = dayjs().subtract(364, 'day').day(); // 0=Sun
    for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push({ date: '', level: -1 }); // empty placeholder
    }

    for (const day of yearData) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) {
        // Pad the end
        while (currentWeek.length < 7) {
            currentWeek.push({ date: '', level: -1 });
        }
        weeks.push(currentWeek);
    }

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleMouseEnter = (day: typeof yearData[number], e: React.MouseEvent) => {
        if (day.level < 0) return;
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const dateStr = dayjs(day.date).format('MMM D, YYYY');
        const levelLabel = LEVEL_LABELS[day.level];
        setTooltip({
            text: `${dateStr} — ${levelLabel}`,
            x: rect.left + rect.width / 2,
            y: rect.top - 8
        });
    };

    const handleMouseLeave = () => setTooltip(null);

    // Count active days
    const activeDays = yearData.filter(d => d.level > 0).length;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    {activeDays} puzzles in the last year
                </h3>
            </div>

            {/* Heatmap grid */}
            <div className="overflow-x-auto pb-2">
                <div className="inline-flex gap-0">
                    {/* Day labels column */}
                    <div className="flex flex-col gap-[3px] mr-2 mt-[22px]">
                        {dayLabels.map((label, i) => (
                            <div key={label} className="h-[13px] flex items-center">
                                {(i === 1 || i === 3 || i === 5) && (
                                    <span className="text-[10px] text-gray-500 leading-none">{label}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div>
                        {/* Month labels */}
                        <div className="flex gap-[3px] mb-1 h-[16px] relative">
                            {monthLabels.map(({ label, col }, i) => (
                                <span
                                    key={`${label}-${i}`}
                                    className="text-[10px] text-gray-500 absolute"
                                    style={{ left: col * 16 }}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Cells */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((day, di) => (
                                        <div
                                            key={`${wi}-${di}`}
                                            className={`w-[13px] h-[13px] rounded-sm transition-all duration-150
                                                ${day.level < 0
                                                    ? 'bg-transparent'
                                                    : `${LEVEL_COLORS[day.level]} hover:ring-2 hover:ring-gray-400 hover:ring-offset-1 cursor-pointer`
                                                }`}
                                            onMouseEnter={(e) => handleMouseEnter(day, e)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3">
                <span className="text-[11px] text-gray-500">Less</span>
                {LEVEL_COLORS.map((color, i) => (
                    <div
                        key={i}
                        className={`w-[13px] h-[13px] rounded-sm ${color}`}
                        title={LEVEL_LABELS[i]}
                    />
                ))}
                <span className="text-[11px] text-gray-500">More</span>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg pointer-events-none whitespace-nowrap"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    {tooltip.text}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
};

export default ActivityHeatmap;
