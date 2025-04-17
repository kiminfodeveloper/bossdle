import React from "react";
import { Boss } from "../types/boss";
import ds1Img from "../imgs/ds1.png";
import ds2Img from "../imgs/ds2.jpg";
import ds3Img from "../imgs/ds3.png";
import defaultImg from "../imgs/default.png";

interface GuessRowProps {
    guess: Boss | null;
    correctBoss: Boss;
    language: "EN" | "PT";
}

// Helper function to extract drop type from soulDrop string
const getDropType = (soulDrop: string): string => {
    if (soulDrop.includes("Arma") || soulDrop.includes("Weapon")) return "Arma";
    if (soulDrop.includes("Anel") || soulDrop.includes("Ring")) return "Anel";
    if (
        soulDrop.includes("Magia") ||
        soulDrop.includes("Magic") ||
        soulDrop.includes("Spell")
    )
        return "Magia";
    return "Nenhum";
};

// Função para obter o nome baseado no idioma
const getLocalizedName = (boss: Boss | null, language: "EN" | "PT"): string => {
    if (!boss) return "";

    if (language === "PT" && boss.namePT) {
        return boss.namePT;
    }
    if (language === "EN" && boss.nameEN) {
        return boss.nameEN;
    }
    return boss.name;
};

// Função para obter a localização baseada no idioma
const getLocalizedLocation = (
    boss: Boss | null,
    language: "EN" | "PT"
): string => {
    if (!boss) return "";

    if (language === "PT" && boss.locationPT) {
        return boss.locationPT;
    }
    if (language === "EN" && boss.locationEN) {
        return boss.locationEN;
    }
    return boss.location;
};

// Função para obter o soul drop baseado no idioma
const getLocalizedSoulDrop = (
    boss: Boss | null,
    language: "EN" | "PT"
): string => {
    if (!boss) return "";

    if (language === "PT" && boss.soulDropPT) {
        return boss.soulDropPT;
    }
    if (language === "EN" && boss.soulDropEN) {
        return boss.soulDropEN;
    }
    return boss.soulDrop;
};

const getCellColor = (
    key: string,
    value: any,
    guess: Boss | null,
    correctBoss: Boss,
    language: "EN" | "PT"
): string => {
    if (!guess) return "bg-gray-700";

    if (key === "name") {
        const guessName = getLocalizedName(guess, language);
        const correctName = getLocalizedName(correctBoss, language);
        return guessName === correctName ? "bg-green-500" : "bg-red-500";
    }

    // Special case for soulDrop - compare only the type
    if (key === "soulDrop") {
        const guessDrop = getLocalizedSoulDrop(guess, language);
        const correctDrop = getLocalizedSoulDrop(correctBoss, language);
        const guessDropType = getDropType(guessDrop);
        const correctDropType = getDropType(correctDrop);
        return guessDropType === correctDropType
            ? "bg-green-500"
            : "bg-red-500";
    }

    if (key === "location") {
        const guessLocation = getLocalizedLocation(guess, language);
        const correctLocation = getLocalizedLocation(correctBoss, language);
        if (guessLocation === correctLocation) return "bg-green-500";
        if (guess.game === correctBoss.game) return "bg-yellow-500";
        return "bg-red-500";
    }

    if (value === correctBoss[key as keyof Boss]) return "bg-green-500";
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

const GuessRow: React.FC<GuessRowProps> = ({
    guess,
    correctBoss,
    language,
}) => {
    // Obter as versões localizadas dos dados
    const localizedName = getLocalizedName(guess, language);
    const localizedLocation = getLocalizedLocation(guess, language);
    const localizedSoulDrop = getLocalizedSoulDrop(guess, language);

    return (
        <div className="mb-4 flex gap-2 items-center">
            {/* Image column on the left */}
            <div className="w-24 flex-shrink-0">
                {guess && (
                    <img
                        src={guess.image || getGameImage(guess.game)}
                        alt={localizedName}
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
                        localizedName,
                        guess,
                        correctBoss,
                        language
                    )}`}
                    title={localizedName || ""}
                >
                    <div className="wrapped-text">{localizedName || ""}</div>
                </div>

                {/* Jogo (2 colunas) */}
                <div
                    className={`col-span-2 grid-cell ${getCellColor(
                        "game",
                        guess?.game,
                        guess,
                        correctBoss,
                        language
                    )}`}
                    title={guess?.game || ""}
                >
                    <div className="wrapped-text">{guess?.game || ""}</div>
                </div>

                {/* Localização (2 colunas) */}
                <div
                    className={`col-span-2 grid-cell ${getCellColor(
                        "location",
                        localizedLocation,
                        guess,
                        correctBoss,
                        language
                    )}`}
                    title={localizedLocation || ""}
                >
                    <div className="wrapped-text">
                        {localizedLocation || ""}
                    </div>
                </div>

                {/* DLC (1 coluna) */}
                <div
                    className={`col-span-1 grid-cell ${getCellColor(
                        "isDLC",
                        guess?.isDLC,
                        guess,
                        correctBoss,
                        language
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
                        correctBoss,
                        language
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
                        localizedSoulDrop,
                        guess,
                        correctBoss,
                        language
                    )}`}
                    title={localizedSoulDrop || ""}
                >
                    <div className="wrapped-text">
                        {guess ? getDropType(localizedSoulDrop) : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuessRow;
