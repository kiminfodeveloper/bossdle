import { useState, useEffect } from "react";
import GuessRow from "./components/GuessRow";
import Footer from "./components/Footer";
import bosses from "./data/bosses.json";
import { Boss } from "./types/boss";
import defaultImg from "./imgs/default.png";
import ds1Img from "./imgs/ds1.png";
import ds2Img from "./imgs/ds2.jpg";
import ds3Img from "./imgs/ds3.png";
import {
    bossNameTranslations,
    locationTranslations,
    soulDropTranslations,
} from "./data/translations";

// Processar os dados para adicionar campos EN e PT
const processedBosses: Boss[] = bosses.flatMap((game) =>
    game.bosses.map((boss) => {
        // Guardar o original como inglês
        const nameEN = boss.name;
        const locationEN = boss.location;
        const soulDropEN = boss.soulDrop;

        // Tentamos encontrar as traduções disponíveis
        const namePT = bossNameTranslations[nameEN] || nameEN;
        const locationPT = locationTranslations[locationEN] || locationEN;
        const soulDropPT = soulDropTranslations[soulDropEN] || soulDropEN;

        return {
            ...boss,
            game: game.game,
            nameEN,
            namePT,
            locationEN,
            locationPT,
            soulDropEN,
            soulDropPT,
        };
    })
);

// Função auxiliar para obter a imagem correta com base no nome do jogo
const getGameImage = (gameName: string): string => {
    const gameNameLower = gameName.toLowerCase();
    if (
        gameNameLower.includes("dark souls 1") ||
        gameNameLower.includes("darksouls1") ||
        gameNameLower === "dark souls"
    ) {
        return ds1Img;
    } else if (
        gameNameLower.includes("dark souls 2") ||
        gameNameLower.includes("darksouls2")
    ) {
        return ds2Img;
    } else if (
        gameNameLower.includes("dark souls 3") ||
        gameNameLower.includes("darksouls3")
    ) {
        return ds3Img;
    }
    return defaultImg;
};

const getBossOfTheDay = (): Boss => {
    // Get current date in Brasilia time (UTC-3)
    const now = new Date();
    // Adjust to Brasilia time using proper timezone calculation
    // First convert to UTC by adding the local timezone offset
    // Then subtract 3 hours (180 minutes) for Brasilia time (UTC-3)
    const brasiliaTime = new Date(
        now.getTime() + now.getTimezoneOffset() * 60000 - 3 * 60 * 60000
    );
    console.log("Current Brasilia time:", brasiliaTime.toISOString());

    // Reset at 6 AM - if it's before 6 AM, use previous day
    const resetDate = new Date(brasiliaTime);
    if (resetDate.getHours() < 6) {
        resetDate.setDate(resetDate.getDate() - 1);
    }
    console.log(
        "Reset date used for boss selection:",
        resetDate.toISOString().split("T")[0]
    );

    // Use YYYY-MM-DD format for the seed
    const dateString = resetDate.toISOString().split("T")[0];

    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = (hash << 5) - hash + dateString.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % processedBosses.length;
    return processedBosses[index];
};

function App() {
    // Get current date in Brasilia time for state management
    const now = new Date();
    // Use the same correct calculation for Brasilia time
    const brasiliaTime = new Date(
        now.getTime() + now.getTimezoneOffset() * 60000 - 3 * 60 * 60000
    );
    const resetDate = new Date(brasiliaTime);
    if (resetDate.getHours() < 6) {
        resetDate.setDate(resetDate.getDate() - 1);
    }
    const today = resetDate.toISOString().split("T")[0];

    // Para fins de diagnóstico
    console.log("Current Brasilia time:", brasiliaTime.toISOString());
    console.log("Date used for boss selection:", today);

    const correctBoss: Boss = getBossOfTheDay();

    // Estado para armazenar o chefe anterior
    const [previousBoss, setPreviousBoss] = useState<string>("");

    const [guess, setGuess] = useState<string>("");
    const [guesses, setGuesses] = useState<Boss[]>(() => {
        const savedState = localStorage.getItem("bossdleState");
        if (savedState) {
            const { lastPlayedDate, guesses, lastBoss } =
                JSON.parse(savedState);

            // Se a data for diferente, começar um novo jogo
            if (lastPlayedDate === today) {
                return guesses;
            } else {
                // Se for um novo dia, salvar o chefe anterior
                if (lastBoss) {
                    setPreviousBoss(lastBoss);
                }
                // Limpar o localStorage para o novo dia
                localStorage.removeItem("bossdleState");
                return [];
            }
        }
        return [];
    });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(() => {
        const savedState = localStorage.getItem("bossdleState");
        if (savedState) {
            const { lastPlayedDate, gameOver } = JSON.parse(savedState);
            if (lastPlayedDate === today) {
                return gameOver;
            }
        }
        return false;
    });
    const [won, setWon] = useState<boolean>(() => {
        const savedState = localStorage.getItem("bossdleState");
        if (savedState) {
            const { lastPlayedDate, won } = JSON.parse(savedState);
            if (lastPlayedDate === today) {
                return won;
            }
        }
        return false;
    });

    useEffect(() => {
        const state = {
            lastPlayedDate: today,
            guesses,
            gameOver,
            won,
            lastBoss: correctBoss.name, // Armazenar o nome do chefe atual para histórico
        };
        localStorage.setItem("bossdleState", JSON.stringify(state));
    }, [guesses, gameOver, won, today, correctBoss.name]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGuess(value);
        if (value.length > 0) {
            const guessedBossNames = guesses.map((g) => g.name.toLowerCase());
            const filtered = processedBosses
                .filter((b) => {
                    // Buscar em todos os nomes disponíveis (inglês e português)
                    const nameMatches = b.name
                        .toLowerCase()
                        .includes(value.toLowerCase());
                    const nameENMatches =
                        b.nameEN?.toLowerCase().includes(value.toLowerCase()) ||
                        false;
                    const namePTMatches =
                        b.namePT?.toLowerCase().includes(value.toLowerCase()) ||
                        false;

                    // Verificar se já foi usado este palpite
                    const alreadyGuessed = guessedBossNames.includes(
                        b.name.toLowerCase()
                    );

                    return (
                        (nameMatches || nameENMatches || namePTMatches) &&
                        !alreadyGuessed
                    );
                })
                .map((b) => {
                    // Retornar o nome no idioma atual
                    return language === "PT" && b.namePT ? b.namePT : b.name;
                })
                .slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleGuess = (guessValue: string) => {
        if (gameOver) return;

        // Procurar o chefe pelo nome em qualquer idioma
        const selectedBoss = processedBosses.find(
            (b) =>
                b.name.toLowerCase() === guessValue.toLowerCase() ||
                (b.namePT &&
                    b.namePT.toLowerCase() === guessValue.toLowerCase()) ||
                (b.nameEN &&
                    b.nameEN.toLowerCase() === guessValue.toLowerCase())
        );

        if (!selectedBoss) {
            alert("Chefe inválido! Escolha um chefe da lista.");
            return;
        }

        const newGuesses = [...guesses, selectedBoss];
        setGuesses(newGuesses);
        setGuess("");
        setSuggestions([]);

        if (selectedBoss.name === correctBoss.name) {
            setGameOver(true);
            setWon(true);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (suggestions.length > 0) {
                const firstSuggestion = suggestions[0];
                setGuess(firstSuggestion);
                handleGuess(firstSuggestion);
            } else if (guess) {
                handleGuess(guess);
            }
        }
    };

    // Novo estado para controlar o modo de visualização
    const [viewMode, setViewMode] = useState<boolean>(false);

    // Função para mostrar a página inicial sem permitir novos palpites
    const handleViewInitialPage = () => {
        setViewMode(true);
    };

    // Novo estado para controlar o idioma
    const [language, setLanguage] = useState<"EN" | "PT">("EN");

    // Função para alternar o idioma
    const toggleLanguage = () => {
        setLanguage((prevLang) => (prevLang === "EN" ? "PT" : "EN"));
    };

    if (gameOver && won && !viewMode) {
        return (
            <div className="flex flex-col items-center min-h-screen justify-between">
                <div className="card">
                    <h1 className="title">Dark Souls Bossdle</h1>
                    {previousBoss && (
                        <p className="text-sm mb-2 text-center text-gray-400">
                            Chefe do dia anterior: {previousBoss}#1
                        </p>
                    )}
                    <p className="text-xl mb-4 text-center">
                        Você já jogou hoje! O chefe era:{" "}
                        <strong>{correctBoss.name}</strong>.
                    </p>
                    {won && (
                        <p className="text-2xl text-green-500 text-center">
                            Parabéns! Você acertou em {guesses.length} tentativa
                            {guesses.length > 1 ? "s" : ""}!
                        </p>
                    )}
                    <img
                        src={getGameImage(correctBoss.game)}
                        alt={correctBoss.game}
                        className="mx-auto mt-4 max-w-xs rounded-lg shadow-md"
                        onError={(e) => {
                            e.currentTarget.src = defaultImg;
                        }}
                    />
                    <p className="mt-4 text-center text-gray-300">
                        Volte amanhã para um novo desafio!
                    </p>
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            onClick={handleViewInitialPage}
                            className="button"
                        >
                            Ver Estado Atual
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen justify-between">
            <div className="card">
                <h1 className="title">Dark Souls Bossdle</h1>
                {previousBoss && (
                    <p className="text-sm mb-2 text-center text-gray-400">
                        Chefe do dia anterior: {previousBoss}#1
                    </p>
                )}
                <p className="text-center mb-4 text-gray-300">
                    Adivinhe o chefe de Dark Souls do dia!
                </p>

                {/* Seletor de idioma */}
                <div className="flex justify-center mb-4">
                    <button
                        className={`button mr-2 ${
                            language === "EN" ? "bg-blue-600" : "bg-blue-800"
                        }`}
                        onClick={() => setLanguage("EN")}
                    >
                        English
                    </button>
                    <button
                        className={`button ${
                            language === "PT" ? "bg-blue-600" : "bg-blue-800"
                        }`}
                        onClick={() => setLanguage("PT")}
                    >
                        Português
                    </button>
                </div>

                <div className="mb-6 relative">
                    <input
                        type="text"
                        value={guess}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="input"
                        placeholder={
                            language === "PT"
                                ? "Digite o nome do chefe..."
                                : "Enter boss name..."
                        }
                        disabled={gameOver}
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((s) => (
                                <li
                                    key={s}
                                    className="suggestion-item"
                                    onClick={() => {
                                        setGuess(s);
                                        setSuggestions([]);
                                        handleGuess(s);
                                    }}
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        onClick={() => handleGuess(guess)}
                        className="button mt-3"
                        disabled={gameOver}
                    >
                        {language === "PT" ? "Enviar Palpite" : "Submit Guess"}
                    </button>

                    {/* Attempt counter below search bar */}
                    <p className="text-center mt-2 text-gray-300">
                        {guesses.length > 0 ? (
                            <span>
                                {guesses.length}{" "}
                                {language === "PT" ? "tentativa" : "attempt"}
                                {guesses.length > 1
                                    ? language === "PT"
                                        ? "s"
                                        : "s"
                                    : ""}
                            </span>
                        ) : null}
                    </p>
                </div>

                {/* Cabeçalho */}
                <div className="flex gap-2 mb-2">
                    {/* Cabeçalho da coluna de imagem - fixado com largura exata */}
                    <div className="flex-shrink-0" style={{ width: "96px" }}>
                        <div className="grid-header h-10">
                            <div className="wrapped-text">
                                {language === "PT" ? "Imagem" : "Image"}
                            </div>
                        </div>
                    </div>
                    {/* Cabeçalho das outras colunas */}
                    <div className="grid grid-cols-10 gap-2 flex-grow">
                        <div className="col-span-2 grid-header h-10">
                            <div className="wrapped-text">
                                {language === "PT" ? "Chefe" : "Boss"}
                            </div>
                        </div>
                        <div className="col-span-2 grid-header h-10">
                            <div className="wrapped-text">
                                {language === "PT" ? "Jogo" : "Game"}
                            </div>
                        </div>
                        <div className="col-span-2 grid-header h-10">
                            <div className="wrapped-text">
                                {language === "PT" ? "Localização" : "Location"}
                            </div>
                        </div>
                        <div className="col-span-1 grid-header h-10">
                            <div className="wrapped-text">DLC?</div>
                        </div>
                        <div className="col-span-1 grid-header h-10">
                            <div className="wrapped-text">
                                {language === "PT" ? "Opcional?" : "Optional?"}
                            </div>
                        </div>
                        <div className="col-span-2 grid-header h-10">
                            <div className="wrapped-text">
                                {language === "PT"
                                    ? "Drop de Alma"
                                    : "Soul Drop"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inverter a ordem para mostrar o palpite mais recente primeiro */}
                {[...guesses].reverse().map((g, i) => (
                    <GuessRow
                        key={i}
                        guess={g}
                        correctBoss={correctBoss}
                        language={language}
                    />
                ))}
                <GuessRow
                    guess={null}
                    correctBoss={correctBoss}
                    language={language}
                />

                {gameOver && (
                    <div className="mt-6 text-center">
                        {won && (
                            <>
                                <p className="text-2xl text-green-500">
                                    {language === "PT" ? (
                                        <>
                                            Parabéns! Você acertou o chefe:{" "}
                                            {correctBoss.name} em{" "}
                                            {guesses.length} tentativa
                                            {guesses.length > 1 ? "s" : ""}!
                                        </>
                                    ) : (
                                        <>
                                            Congratulations! You got the boss:{" "}
                                            {correctBoss.name} in{" "}
                                            {guesses.length} attempt
                                            {guesses.length > 1 ? "s" : ""}!
                                        </>
                                    )}
                                </p>
                                <img
                                    src={getGameImage(correctBoss.game)}
                                    alt={correctBoss.game}
                                    className="mx-auto mt-4 max-w-xs rounded-lg shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.src = defaultImg;
                                    }}
                                />
                            </>
                        )}
                        <p className="mt-4 text-gray-300">
                            {language === "PT"
                                ? "Volte amanhã para um novo desafio!"
                                : "Come back tomorrow for a new challenge!"}
                        </p>
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                onClick={handleViewInitialPage}
                                className="button mt-4"
                            >
                                {language === "PT"
                                    ? "Ver Estado Atual"
                                    : "View Current State"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default App;
