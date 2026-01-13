export default function RiskGauge({ score }) {
    // Score 0-100. Lower is Better? Usually for Risk, High Score = High Risk. 
    // Let's assume Score is "Safety Score" (0=Bad, 100=Good) or "Risk Score" (0=Safe, 100=Risky).
    // Implementation Plan said "Counterparty risk scoring". Usually 100 is "High Risk".
    // Let's implement: 0-33 Low, 34-66 Medium, 67-100 High.

    let color = 'bg-green-500';
    let label = 'Low Risk';

    if (score > 33 && score <= 66) {
        color = 'bg-yellow-500';
        label = 'Medium Risk';
    } else if (score > 66) {
        color = 'bg-red-500';
        label = 'High Risk';
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative h-32 w-32">
                <div className="absolute top-0 left-0 h-full w-full rounded-full border-8 border-gray-200"></div>
                <div
                    className={`absolute top-0 left-0 h-full w-full rounded-full border-8 border-transparent border-t-${color.split('-')[1]}-500 border-r-${color.split('-')[1]}-500 transform -rotate-45`}
                    style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }} // Hacky CSS gauge, better to use SVG but this is faster
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{score}</span>
                    <span className="text-xs text-gray-500">{label}</span>
                </div>
            </div>
        </div>
    );
}
