import { useState, useEffect } from "react";
import GuessRow from "./components/GuessRow";
import Footer from "./components/Footer";
import bosses from "./data/bosses.json";
import { Boss } from "./types/boss";
import defaultImg from "./imgs/default.png";
import ds1Img from "./imgs/ds1.png";
import ds2Img from "./imgs/ds2.jpg";
import ds3Img from "./imgs/ds3.png";

const allBosses: Boss[] = bosses.flatMap((game) =>
    game.bosses.map((boss) => ({ ...boss, game: game.game }))
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
    // Adjust to Brasilia time
    const brasiliaTime = new Date(
        now.getTime() - (now.getTimezoneOffset() + 180) * 60000
    );
    // Reset at 6 AM - if it's before 6 AM, use previous day
    const resetDate = new Date(brasiliaTime);
    if (resetDate.getHours() < 6) {
        resetDate.setDate(resetDate.getDate() - 1);
    }
    // Use YYYY-MM-DD format for the seed
    const dateString = resetDate.toISOString().split("T")[0];

    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = (hash << 5) - hash + dateString.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % allBosses.length;
    return allBosses[index];
};

function App() {
    // Get current date in Brasilia time for state management
    const now = new Date();
    const brasiliaTime = new Date(
        now.getTime() - (now.getTimezoneOffset() + 180) * 60000
    );
    const resetDate = new Date(brasiliaTime);
    if (resetDate.getHours() < 6) {
        resetDate.setDate(resetDate.getDate() - 1);
    }
    const today = resetDate.toISOString().split("T")[0];

    const correctBoss: Boss = getBossOfTheDay();

    const [guess, setGuess] = useState<string>("");
    const [guesses, setGuesses] = useState<Boss[]>(() => {
        const savedState = localStorage.getItem("bossdleState");
        if (savedState) {
            const { lastPlayedDate, guesses } = JSON.parse(savedState);
            if (lastPlayedDate === today) {
                return guesses;
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
        };
        localStorage.setItem("bossdleState", JSON.stringify(state));
    }, [guesses, gameOver, won, today]);

    const handleGuess = (guessValue: string) => {
        if (gameOver) return;

        const selectedBoss = allBosses.find(
            (b) => b.name.toLowerCase() === guessValue.toLowerCase()
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGuess(value);
        if (value.length > 0) {
            const guessedBossNames = guesses.map((g) => g.name.toLowerCase());
            const filtered = allBosses
                .filter(
                    (b) =>
                        b.name.toLowerCase().includes(value.toLowerCase()) &&
                        !guessedBossNames.includes(b.name.toLowerCase())
                )
                .map((b) => b.name)
                .slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    if (gameOver && won) {
        return (
            <div className="flex flex-col items-center min-h-screen justify-between">
                <div className="card">
                    <h1 className="title">Dark Souls Bossdle</h1>
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
                    <button
                        onClick={() => window.location.reload()}
                        className="button mt-4"
                    >
                        Ver Estado Atual
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen justify-between">
            <div className="card">
                <h1 className="title">Dark Souls Bossdle</h1>
                <p className="text-center mb-4 text-gray-300">
                    Adivinhe o chefe de Dark Souls do dia!
                </p>

                <div className="mb-6 relative">
                    <input
                        type="text"
                        value={guess}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="input"
                        placeholder="Digite o nome do chefe..."
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
                        Enviar Palpite
                    </button>

                    {/* Attempt counter below search bar */}
                    <p className="text-center mt-2 text-gray-300">
                        {guesses.length > 0 ? (
                            <span>
                                {guesses.length} tentativa
                                {guesses.length > 1 ? "s" : ""}
                            </span>
                        ) : null}
                    </p>
                </div>

                <div className="grid grid-cols-6 gap-2 mb-2">
                    <div className="grid-header">Chefe</div>
                    <div className="grid-header">Jogo</div>
                    <div className="grid-header">Localização</div>
                    <div className="grid-header">DLC?</div>
                    <div className="grid-header">Opcional?</div>
                    <div className="grid-header">Drop de Alma</div>
                </div>

                {guesses.map((g, i) => (
                    <GuessRow key={i} guess={g} correctBoss={correctBoss} />
                ))}
                <GuessRow guess={null} correctBoss={correctBoss} />

                {gameOver && (
                    <div className="mt-6 text-center">
                        {won && (
                            <>
                                <p className="text-2xl text-green-500">
                                    Parabéns! Você acertou o chefe:{" "}
                                    {correctBoss.name} em {guesses.length}{" "}
                                    tentativa
                                    {guesses.length > 1 ? "s" : ""}!
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
                            Volte amanhã para um novo desafio!
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="button mt-4"
                        >
                            Ver Estado Atual
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default App;
