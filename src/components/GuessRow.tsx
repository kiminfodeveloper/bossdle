import { Boss } from "../types/boss";

interface GuessRowProps {
    guess: Boss | null;
    correctBoss: Boss;
}

const getCellColor = (
    key: string,
    value: any,
    guess: Boss | null,
    correctBoss: Boss
): string => {
    if (!guess) return "bg-gray-700";
    if (key === "name")
        return value === correctBoss.name ? "bg-green-500" : "bg-red-500";
    if (value === correctBoss[key as keyof Boss]) return "bg-green-500";
    if (key === "location" && guess.game === correctBoss.game)
        return "bg-yellow-500";
    return "bg-red-500";
};

const GuessRow: React.FC<GuessRowProps> = ({ guess, correctBoss }) => {
    return (
        <div className="grid grid-cols-6 gap-2 mb-2">
            <div
                className={`p-2 text-center truncate ${getCellColor(
                    "name",
                    guess?.name,
                    guess,
                    correctBoss
                )}`}
            >
                {guess?.name || ""}
            </div>
            <div
                className={`p-2 text-center truncate ${getCellColor(
                    "game",
                    guess?.game,
                    guess,
                    correctBoss
                )}`}
            >
                {guess?.game || ""}
            </div>
            <div
                className={`p-2 text-center truncate ${getCellColor(
                    "location",
                    guess?.location,
                    guess,
                    correctBoss
                )}`}
            >
                {guess?.location || ""}
            </div>
            <div
                className={`p-2 text-center truncate ${getCellColor(
                    "isDLC",
                    guess?.isDLC,
                    guess,
                    correctBoss
                )}`}
            >
                {guess?.isDLC ? "Sim" : "Não"}
            </div>
            <div
                className={`p-2 text-center truncate ${getCellColor(
                    "isOptional",
                    guess?.isOptional,
                    guess,
                    correctBoss
                )}`}
            >
                {guess?.isOptional ? "Sim" : "Não"}
            </div>
            <div
                className={`p-2 text-center truncate ${getCellColor(
                    "soulDrop",
                    guess?.soulDrop,
                    guess,
                    correctBoss
                )}`}
            >
                {guess?.soulDrop || ""}
            </div>
        </div>
    );
};

export default GuessRow;
