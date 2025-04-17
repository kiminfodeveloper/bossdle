import React from "react";
import { Boss } from "../types/boss";
import ds1Img from "../imgs/ds1.png";
import ds2Img from "../imgs/ds2.jpg";
import ds3Img from "../imgs/ds3.png";
import defaultImg from "../imgs/default.png";

interface GuessRowProps {
    guess: Boss | null;
    correctBoss: Boss;
}

// Helper function to extract drop type from soulDrop string
const getDropType = (soulDrop: string): string => {
    if (soulDrop.includes("Arma")) return "Arma";
    if (soulDrop.includes("Anel")) return "Anel";
    if (soulDrop.includes("Magia")) return "Magia";
    return "Nenhum";
};

const getCellColor = (
    key: string,
    value: any,
    guess: Boss | null,
    correctBoss: Boss
): string => {
    if (!guess) return "bg-gray-700";

    if (key === "name")
        return value === correctBoss.name ? "bg-green-500" : "bg-red-500";

    // Special case for soulDrop - compare only the type
    if (key === "soulDrop") {
        const guessDropType = getDropType(guess.soulDrop);
        const correctDropType = getDropType(correctBoss.soulDrop);
        return guessDropType === correctDropType
            ? "bg-green-500"
            : "bg-red-500";
    }

    if (value === correctBoss[key as keyof Boss]) return "bg-green-500";
    if (key === "location" && guess.game === correctBoss.game)
        return "bg-yellow-500";

    return "bg-red-500";
};

// Helper function to get the appropriate game image
const getGameImage = (game: string): string => {
    if (game === "Dark Souls 1") {
        return ds1Img;
    } else if (game === "Dark Souls 2") {
        return ds2Img;
    } else if (game === "Dark Souls 3") {
        return ds3Img;
    }
    return ds1Img; // Default fallback
};

const GuessRow: React.FC<GuessRowProps> = ({ guess, correctBoss }) => {
    return (
        <div className="mb-4 flex gap-2 items-center">
            {/* Image column on the left */}
            <div className="w-24 flex-shrink-0">
                {guess && (
                    <img
                        src={guess.image || getGameImage(guess.game)}
                        alt={guess.name}
                        className="w-24 h-24 object-cover rounded-md shadow-md"
                        onError={(
                            e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => {
                            e.currentTarget.src = getGameImage(guess.game);
                        }}
                    />
                )}
            </div>

            {/* Boss information grid - adjusted to match header */}
            <div className="grid grid-cols-10 gap-2 flex-grow">
                {/* Nome (2 colunas) */}
                <div
                    className={`col-span-2 grid-cell ${getCellColor(
                        "name",
                        guess?.name,
                        guess,
                        correctBoss
                    )}`}
                    title={guess?.name || ""}
                >
                    <div className="wrapped-text">{guess?.name || ""}</div>
                </div>

                {/* Jogo (2 colunas) */}
                <div
                    className={`col-span-2 grid-cell ${getCellColor(
                        "game",
                        guess?.game,
                        guess,
                        correctBoss
                    )}`}
                    title={guess?.game || ""}
                >
                    <div className="wrapped-text">{guess?.game || ""}</div>
                </div>

                {/* Localização (2 colunas) */}
                <div
                    className={`col-span-2 grid-cell ${getCellColor(
                        "location",
                        guess?.location,
                        guess,
                        correctBoss
                    )}`}
                    title={guess?.location || ""}
                >
                    <div className="wrapped-text">{guess?.location || ""}</div>
                </div>

                {/* DLC (1 coluna) */}
                <div
                    className={`col-span-1 grid-cell ${getCellColor(
                        "isDLC",
                        guess?.isDLC,
                        guess,
                        correctBoss
                    )}`}
                    title={
                        guess?.isDLC !== undefined
                            ? guess?.isDLC
                                ? "Sim"
                                : "Não"
                            : ""
                    }
                >
                    {guess?.isDLC !== undefined
                        ? guess?.isDLC
                            ? "Sim"
                            : "Não"
                        : ""}
                </div>

                {/* Opcional (1 coluna) */}
                <div
                    className={`col-span-1 grid-cell ${getCellColor(
                        "isOptional",
                        guess?.isOptional,
                        guess,
                        correctBoss
                    )}`}
                    title={
                        guess?.isOptional !== undefined
                            ? guess?.isOptional
                                ? "Sim"
                                : "Não"
                            : ""
                    }
                >
                    {guess?.isOptional !== undefined
                        ? guess?.isOptional
                            ? "Sim"
                            : "Não"
                        : ""}
                </div>

                {/* Drop de Alma (2 colunas) */}
                <div
                    className={`col-span-2 grid-cell ${getCellColor(
                        "soulDrop",
                        guess?.soulDrop,
                        guess,
                        correctBoss
                    )}`}
                    title={guess ? guess.soulDrop : ""}
                >
                    <div className="wrapped-text">
                        {guess ? getDropType(guess.soulDrop) : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuessRow;
