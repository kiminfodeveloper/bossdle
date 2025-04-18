import { useState, useEffect } from "react";
import GuessRow from "./components/GuessRow";
import Footer from "./components/Footer";
import bosses from "./data/bosses.json";
import eldenBosses from "./data/bosseselden.json";
import { Boss } from "./types/boss";
import defaultImg from "./imgs/default.png";
import ds1Img from "./imgs/ds1.png";
import ds2Img from "./imgs/ds2.jpg";
import ds3Img from "./imgs/ds3.png";
import endelRingImg from "./imgs/endelring.webp";
import iconImg from "./imgs/icon.webp";
import {
    bossNameTranslations,
    locationTranslations,
    soulDropTranslations,
} from "./data/translations";

// Navbar component
const Navbar = () => {
    return (
        <nav className="w-full bg-gray-900 shadow-md px-4 py-3 mb-6 flex items-center">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src={iconImg}
                        alt="Bossdle Logo"
                        className="h-10 w-10 mr-3"
                        onError={(e) => {
                            e.currentTarget.src = defaultImg;
                        }}
                    />
                </div>
                <div className="flex space-x-6">
                    <a
                        href="#"
                        className="text-white font-bold text-xl hover:text-yellow-400 transition-colors"
                    >
                        Bossdle
                    </a>
                    <a
                        href="#"
                        className="text-gray-400 font-bold text-xl hover:text-yellow-400 transition-colors"
                    >
                        Eldendle
                    </a>
                </div>
            </div>
        </nav>
    );
};

// Processar os dados de Dark Souls para adicionar campos EN e PT
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

// Processar os dados de Elden Ring
const processedEldenBosses: Boss[] = eldenBosses.flatMap((game) =>
    game.bosses.map((boss) => {
        // Os bosses de Elden Ring já vêm com todos os campos necessários
        return {
            ...boss,
            game: boss.game,
        };
    })
);

// Função auxiliar para obter a imagem correta com base no nome do jogo
const getGameImage = (gameName: string): string => {
    switch (gameName) {
        case "Dark Souls":
            return ds1Img;
        case "Dark Souls II":
            return ds2Img;
        case "Dark Souls III":
            return ds3Img;
        case "Elden Ring":
            return endelRingImg;
        default:
            return defaultImg;
    }
};

const getBossOfTheDay = (isEldenMode: boolean = false): Boss => {
    // Escolher o conjunto de dados correto com base no modo
    const bossesData = isEldenMode ? processedEldenBosses : processedBosses;

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
    const index = Math.abs(hash) % bossesData.length;
    return bossesData[index];
};

// Função para obter um boss aleatório para o minigame de imagem
const getRandomBoss = (): Boss => {
    const randomIndex = Math.floor(Math.random() * processedBosses.length);
    return processedBosses[randomIndex];
};

// Define the Welcome Modal component
const WelcomeModal = ({
    onClose,
    language,
    isEldenMode,
}: {
    onClose: () => void;
    language: "EN" | "PT";
    isEldenMode: boolean;
}) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-xl w-full border border-gray-700 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-yellow-400">
                        {language === "PT"
                            ? `Bem-vindo ao ${
                                  isEldenMode ? "Eldendle" : "Bossdle"
                              }!`
                            : `Welcome to ${
                                  isEldenMode ? "Eldendle" : "Bossdle"
                              }!`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <i className="bi bi-x-lg text-xl"></i>
                    </button>
                </div>

                <div className="space-y-4 text-gray-300">
                    <p>
                        {language === "PT"
                            ? isEldenMode
                                ? "Eldendle é um jogo diário no estilo Wordle onde você tenta adivinhar o chefe de Elden Ring do dia."
                                : "Bossdle é um jogo diário no estilo Wordle onde você tenta adivinhar o chefe de Dark Souls do dia."
                            : isEldenMode
                            ? "Eldendle is a daily Wordle-style game where you try to guess the Elden Ring boss of the day."
                            : "Bossdle is a daily Wordle-style game where you try to guess the Dark Souls boss of the day."}
                    </p>

                    <div className="bg-gray-800 p-3 rounded-lg">
                        <h3 className="font-semibold text-yellow-300 mb-2">
                            {language === "PT" ? "Como jogar:" : "How to play:"}
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                {language === "PT"
                                    ? "Tente adivinhar o nome do chefe usando a barra de pesquisa."
                                    : "Try to guess the boss name using the search bar."}
                            </li>
                            <li>
                                {language === "PT"
                                    ? "Após cada tentativa, você verá quais características combinam com o chefe do dia."
                                    : "After each guess, you'll see which characteristics match with the boss of the day."}
                            </li>
                            <li>
                                {language === "PT"
                                    ? "Células em verde significam uma combinação exata, em amarelo uma combinação parcial."
                                    : "Green cells mean an exact match, yellow cells mean a partial match."}
                            </li>
                            <li>
                                {language === "PT"
                                    ? "Um novo chefe é selecionado todos os dias às 6h (horário de Brasília)."
                                    : "A new boss is selected every day at 6 AM (Brasilia Time)."}
                            </li>
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={onClose} className="button">
                            {language === "PT"
                                ? "Começar a jogar!"
                                : "Start playing!"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define the Bug Report Modal component
const BugReportModal = ({
    onClose,
    language,
}: {
    onClose: () => void;
    language: "EN" | "PT";
}) => {
    const [bugDescription, setBugDescription] = useState<string>("");
    const [steps, setSteps] = useState<string>("");

    const handleSubmit = () => {
        // Format the message for WhatsApp
        const message = `*Bug Report from Bossdle*\n\n*Description:*\n${bugDescription}\n\n*Steps to Reproduce:*\n${steps}`;

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);

        // Create WhatsApp link with the message
        const whatsappUrl = `https://wa.me/5511991231629?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, "_blank");

        // Close the modal
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-xl w-full border border-gray-700 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-yellow-400">
                        {language === "PT" ? "Reportar um Bug" : "Report a Bug"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <i className="bi bi-x-lg text-xl"></i>
                    </button>
                </div>

                <div className="space-y-4 text-gray-300">
                    <p>
                        {language === "PT"
                            ? "Por favor, descreva o bug que você encontrou. Isso nos ajudará a corrigi-lo rapidamente."
                            : "Please describe the bug you've found. This will help us fix it quickly."}
                    </p>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {language === "PT"
                                    ? "Descrição do bug:"
                                    : "Bug description:"}
                            </label>
                            <textarea
                                value={bugDescription}
                                onChange={(e) =>
                                    setBugDescription(e.target.value)
                                }
                                className="input min-h-[80px]"
                                placeholder={
                                    language === "PT"
                                        ? "Descreva o problema..."
                                        : "Describe the issue..."
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {language === "PT"
                                    ? "Passos para reproduzir:"
                                    : "Steps to reproduce:"}
                            </label>
                            <textarea
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                className="input min-h-[80px]"
                                placeholder={
                                    language === "PT"
                                        ? "Como podemos reproduzir este bug?"
                                        : "How can we reproduce this bug?"
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                        >
                            {language === "PT" ? "Cancelar" : "Cancel"}
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="button flex items-center gap-2"
                            disabled={!bugDescription.trim()}
                        >
                            <i className="bi bi-whatsapp text-green-400"></i>
                            {language === "PT"
                                ? "Enviar via WhatsApp"
                                : "Send via WhatsApp"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
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

    // Novo estado para controlar o modo Eldendle
    const [eldenMode, setEldenMode] = useState<boolean>(false);

    // Obter o boss correto baseado no modo
    const correctBoss: Boss = getBossOfTheDay(eldenMode);

    // Estado para armazenar o chefe anterior
    const [previousBoss, setPreviousBoss] = useState<string>("");
    const [previousEldenBoss, setPreviousEldenBoss] = useState<string>("");

    const [guess, setGuess] = useState<string>("");
    const [guesses, setGuesses] = useState<Boss[]>(() => {
        const savedState = localStorage.getItem(
            eldenMode ? "eldendleState" : "bossdleState"
        );
        if (savedState) {
            const { lastPlayedDate, guesses, lastBoss } =
                JSON.parse(savedState);

            // Se a data for diferente, começar um novo jogo
            if (lastPlayedDate === today) {
                return guesses;
            } else {
                // Se for um novo dia, salvar o chefe anterior
                if (lastBoss) {
                    if (eldenMode) {
                        setPreviousEldenBoss(lastBoss);
                    } else {
                        setPreviousBoss(lastBoss);
                    }
                }
                // Limpar o localStorage para o novo dia
                localStorage.removeItem(
                    eldenMode ? "eldendleState" : "bossdleState"
                );
                return [];
            }
        }
        return [];
    });
    const [suggestions, setSuggestions] = useState<
        { name: string; boss: Boss }[]
    >([]);
    const [gameOver, setGameOver] = useState<boolean>(() => {
        const savedState = localStorage.getItem(
            eldenMode ? "eldendleState" : "bossdleState"
        );
        if (savedState) {
            const { lastPlayedDate, gameOver } = JSON.parse(savedState);
            if (lastPlayedDate === today) {
                return gameOver;
            }
        }
        return false;
    });
    const [won, setWon] = useState<boolean>(() => {
        const savedState = localStorage.getItem(
            eldenMode ? "eldendleState" : "bossdleState"
        );
        if (savedState) {
            const { lastPlayedDate, won } = JSON.parse(savedState);
            if (lastPlayedDate === today) {
                return won;
            }
        }
        return false;
    });

    // Resetar estados quando mudar entre Bossdle e Eldendle
    useEffect(() => {
        // Carregar os dados salvos do modo correto
        const savedState = localStorage.getItem(
            eldenMode ? "eldendleState" : "bossdleState"
        );

        if (savedState) {
            const { lastPlayedDate, guesses, gameOver, won, lastBoss } =
                JSON.parse(savedState);

            if (lastPlayedDate === today) {
                setGuesses(guesses);
                setGameOver(gameOver);
                setWon(won);
            } else {
                setGuesses([]);
                setGameOver(false);
                setWon(false);
                // Se for um novo dia, salvar o chefe anterior
                if (lastBoss) {
                    if (eldenMode) {
                        setPreviousEldenBoss(lastBoss);
                    } else {
                        setPreviousBoss(lastBoss);
                    }
                }
            }
        } else {
            // Sem estado salvo, resetar
            setGuesses([]);
            setGameOver(false);
            setWon(false);
        }

        // Limpar outras coisas
        setGuess("");
        setSuggestions([]);
        setViewMode(false);
        setImageGameMode(false);
    }, [eldenMode, today]);

    useEffect(() => {
        const state = {
            lastPlayedDate: today,
            guesses,
            gameOver,
            won,
            lastBoss: correctBoss.name, // Armazenar o nome do chefe atual para histórico
        };
        localStorage.setItem(
            eldenMode ? "eldendleState" : "bossdleState",
            JSON.stringify(state)
        );
    }, [guesses, gameOver, won, today, correctBoss.name, eldenMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGuess(value);
        if (value.length > 0) {
            // Escolher o conjunto de dados correto com base no modo
            const bossesData = eldenMode
                ? processedEldenBosses
                : processedBosses;

            const guessedBossNames = guesses.map((g) => g.name.toLowerCase());
            const filteredBosses = bossesData
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
                .slice(0, 5);

            // Transformar para incluir o objeto boss completo
            const suggestionItems = filteredBosses.map((boss) => ({
                name:
                    language === "PT" && boss.namePT ? boss.namePT : boss.name,
                boss: boss,
            }));

            setSuggestions(suggestionItems);
        } else {
            setSuggestions([]);
        }
    };

    const handleGuess = (guessValue: string) => {
        if (gameOver) return;

        // Escolher o conjunto de dados correto com base no modo
        const bossesData = eldenMode ? processedEldenBosses : processedBosses;

        // Procurar o chefe pelo nome em qualquer idioma
        const selectedBoss = bossesData.find(
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
                const firstSuggestion = suggestions[0].name;
                setGuess(firstSuggestion);
                handleGuess(firstSuggestion);
            } else if (guess) {
                handleGuess(guess);
            }
        }
    };

    // Novo estado para controlar o modo de visualização
    const [viewMode, setViewMode] = useState<boolean>(false);

    // Novo estado para controlar o minigame de imagem
    const [imageGameMode, setImageGameMode] = useState<boolean>(false);
    const [imageBoss, setImageBoss] = useState<Boss | null>(null);
    const [imageGuesses, setImageGuesses] = useState<string[]>([]);
    const [imageGameOver, setImageGameOver] = useState<boolean>(false);
    const [imageGameWon, setImageGameWon] = useState<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState<number>(8); // Níveis de zoom (8=mais zoom, ajustado para ser mais próximo)

    // Função para iniciar o minigame de imagem
    const handleStartImageGame = () => {
        setImageBoss(getRandomBoss());
        setImageGuesses([]);
        setImageGameMode(true);
        setImageGameOver(false);
        setImageGameWon(false);
        setZoomLevel(8); // Zoom inicial mais próximo
    };

    // Função para lidar com palpites no minigame de imagem
    const handleImageGuess = (guessValue: string) => {
        if (imageGameOver) return;

        // Verificar se o palpite já foi feito
        if (imageGuesses.includes(guessValue)) {
            alert("Você já tentou este chefe!");
            return;
        }

        // Adicionar o palpite à lista
        const newGuesses = [...imageGuesses, guessValue];
        setImageGuesses(newGuesses);
        setGuess("");
        setSuggestions([]);

        // Verificar se o palpite está correto
        if (
            imageBoss &&
            (guessValue.toLowerCase() === imageBoss.name.toLowerCase() ||
                (imageBoss.namePT &&
                    guessValue.toLowerCase() ===
                        imageBoss.namePT.toLowerCase()) ||
                (imageBoss.nameEN &&
                    guessValue.toLowerCase() ===
                        imageBoss.nameEN.toLowerCase()))
        ) {
            setImageGameOver(true);
            setImageGameWon(true);
        } else {
            // Diminuir o zoom após cada palpite errado, de forma mais suave
            // Continuar reduzindo o zoom sem limite mínimo
            setZoomLevel(Math.max(zoomLevel - 0.8, 0.5)); // Diminui o zoom mas mantém um mínimo de 0.5 para não ficar muito distante
        }
    };

    // Função para voltar ao estado inicial
    const handleGoBack = () => {
        setViewMode(false);
        setImageGameMode(false);
    };

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

    // Função para mostrar o modo Eldendle
    const handleEldenModeClick = () => {
        setEldenMode(true);
        setImageGameMode(false);
        setViewMode(false);
    };

    // Função para voltar ao modo Bossdle
    const handleBossdleModeClick = () => {
        setEldenMode(false);
        setImageGameMode(false);
        setViewMode(false);
    };

    // Add state for welcome modal
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);

    // Check if this is the first visit
    useEffect(() => {
        const hasVisitedBefore = localStorage.getItem("bossdle_visited");
        if (!hasVisitedBefore) {
            setShowWelcomeModal(true);
            localStorage.setItem("bossdle_visited", "true");
        }
    }, []);

    // Function to close welcome modal
    const handleCloseWelcomeModal = () => {
        setShowWelcomeModal(false);
    };

    // Add state for bug report modal
    const [showBugReportModal, setShowBugReportModal] =
        useState<boolean>(false);

    // Function to close bug report modal
    const handleCloseBugReportModal = () => {
        setShowBugReportModal(false);
    };

    // Navbar component with handlers
    const NavbarWithHandlers = () => {
        return (
            <nav className="w-full bg-gray-900 shadow-md px-4 py-3 mb-6 flex items-center">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src={iconImg}
                            alt="Bossdle Logo"
                            className="h-10 w-10 mr-3"
                            onError={(e) => {
                                e.currentTarget.src = defaultImg;
                            }}
                        />
                    </div>
                    <div className="flex space-x-6">
                        <a
                            href="#"
                            onClick={handleBossdleModeClick}
                            className={`font-bold text-xl hover:text-yellow-400 transition-colors ${
                                !eldenMode ? "text-white" : "text-gray-400"
                            }`}
                        >
                            Bossdle
                        </a>
                        <a
                            href="#"
                            onClick={handleEldenModeClick}
                            className={`font-bold text-xl hover:text-yellow-400 transition-colors ${
                                eldenMode ? "text-white" : "text-gray-400"
                            }`}
                        >
                            Eldendle
                        </a>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowWelcomeModal(true)}
                            className="px-2 py-1 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center"
                            title={
                                language === "PT" ? "Como jogar" : "How to play"
                            }
                        >
                            <i className="bi bi-question-circle mr-1"></i>
                            {language === "PT" ? "Ajuda" : "Help"}
                        </button>
                        <button
                            onClick={() => setShowBugReportModal(true)}
                            className="px-2 py-1 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center"
                            title={
                                language === "PT"
                                    ? "Reportar um bug"
                                    : "Report a bug"
                            }
                        >
                            <i className="bi bi-bug mr-1"></i>
                            {language === "PT" ? "Reportar Bug" : "Report Bug"}
                        </button>
                        <button
                            onClick={() => setLanguage("EN")}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                language === "EN"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage("PT")}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                language === "PT"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            Português-BR
                        </button>
                    </div>
                </div>
            </nav>
        );
    };

    // Se estiver no modo Eldendle real (não a página "em construção")
    // Este é o jogo completo de Eldendle, não apenas a mensagem de "em construção"
    if (eldenMode) {
        return (
            <div className="flex flex-col items-center min-h-screen justify-between">
                <NavbarWithHandlers />
                <div className="card">
                    <h1 className="title">Eldendle</h1>
                    {previousEldenBoss && (
                        <p className="text-sm mb-2 text-center text-gray-400">
                            {language === "PT"
                                ? "Chefe do dia anterior: "
                                : "Previous day's boss: "}
                            {previousEldenBoss}
                        </p>
                    )}
                    <p className="text-center mb-4 text-gray-300">
                        {language === "PT"
                            ? "Adivinhe o chefe de Elden Ring do dia!"
                            : "Guess the Elden Ring boss of the day!"}
                    </p>

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
                                {suggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.name}
                                        className="suggestion-item flex items-center p-2"
                                        onClick={() => {
                                            setGuess(suggestion.name);
                                            setSuggestions([]);
                                            handleGuess(suggestion.name);
                                        }}
                                    >
                                        <img
                                            src={suggestion.boss.image}
                                            alt={suggestion.name}
                                            className="w-8 h-8 mr-2 rounded-full object-cover border border-gray-700 shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    getGameImage(
                                                        suggestion.boss.game
                                                    );
                                            }}
                                        />
                                        <span>{suggestion.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            onClick={() => handleGuess(guess)}
                            className="button mt-3"
                            disabled={gameOver}
                        >
                            {language === "PT"
                                ? "Enviar Palpite"
                                : "Submit Guess"}
                        </button>

                        {/* Attempt counter below search bar */}
                        <p className="text-center mt-2 text-gray-300">
                            {guesses.length > 0 ? (
                                <span>
                                    {guesses.length}{" "}
                                    {language === "PT"
                                        ? "tentativa"
                                        : "attempt"}
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
                        <div
                            className="flex-shrink-0"
                            style={{ width: "96px" }}
                        >
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
                                    {language === "PT"
                                        ? "Localização"
                                        : "Location"}
                                </div>
                            </div>
                            <div className="col-span-1 grid-header h-10">
                                <div className="wrapped-text">DLC?</div>
                            </div>
                            <div className="col-span-1 grid-header h-10">
                                <div className="wrapped-text">
                                    {language === "PT"
                                        ? "Opcional?"
                                        : "Optional?"}
                                </div>
                            </div>
                            <div className="col-span-2 grid-header h-10">
                                <div className="wrapped-text">
                                    {language === "PT"
                                        ? "Lembrança"
                                        : "Remembrance"}
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
                                                Congratulations! You got the
                                                boss: {correctBoss.name} in{" "}
                                                {guesses.length} attempt
                                                {guesses.length > 1 ? "s" : ""}!
                                            </>
                                        )}
                                    </p>
                                    <img
                                        src={correctBoss.image}
                                        alt={correctBoss.name}
                                        className="mx-auto mt-4 max-w-xs rounded-lg shadow-md"
                                        onError={(e) => {
                                            e.currentTarget.src = getGameImage(
                                                correctBoss.game
                                            );
                                        }}
                                    />
                                </>
                            )}
                            <p className="mt-4 text-gray-300">
                                {language === "PT"
                                    ? "Volte amanhã para um novo desafio!"
                                    : "Come back tomorrow for a new challenge!"}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                <button
                                    onClick={handleViewInitialPage}
                                    className="button"
                                >
                                    {language === "PT"
                                        ? "Ver Estado Atual"
                                        : "View Current State"}
                                </button>
                                <button
                                    onClick={handleStartImageGame}
                                    className="button"
                                >
                                    {language === "PT"
                                        ? "Adivinhe o Chefe pela Imagem"
                                        : "Guess the Boss by Image"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Welcome Modal */}
                    {showWelcomeModal && (
                        <WelcomeModal
                            onClose={handleCloseWelcomeModal}
                            language={language}
                            isEldenMode={true}
                        />
                    )}

                    {/* Bug Report Modal */}
                    {showBugReportModal && (
                        <BugReportModal
                            onClose={handleCloseBugReportModal}
                            language={language}
                        />
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    if (imageGameMode) {
        return (
            <div className="flex flex-col items-center min-h-screen justify-between">
                <NavbarWithHandlers />
                <div className="card">
                    <h1 className="title">
                        {language === "PT"
                            ? "Adivinhe o Chefe pela Imagem"
                            : "Guess the Boss by Image"}
                    </h1>
                    <p className="text-center mb-4 text-gray-300">
                        {language === "PT"
                            ? "Tente adivinhar qual chefe é mostrado na imagem ampliada."
                            : "Try to guess which boss is shown in the zoomed image."}
                    </p>

                    {/* Imagem com zoom */}
                    {imageBoss && (
                        <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-lg border-2 border-gray-700 mb-4">
                            <img
                                src={imageBoss.image}
                                alt="???"
                                className="absolute w-auto h-auto min-w-full min-h-full"
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                    transformOrigin: "center center",
                                    transition: "transform 0.5s ease-in-out",
                                }}
                                onError={(e) => {
                                    e.currentTarget.src = getGameImage(
                                        imageBoss.game
                                    );
                                }}
                            />
                        </div>
                    )}

                    {/* Status do jogo */}
                    <div className="mb-2 text-center">
                        <p className="text-gray-300">
                            {language === "PT" ? "Tentativas: " : "Attempts: "}
                            {imageGuesses.length}
                        </p>
                    </div>

                    {/* Input para palpites */}
                    {!imageGameOver && (
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                value={guess}
                                onChange={(e) => {
                                    // Lógica específica para o minigame de imagem
                                    const value = e.target.value;
                                    setGuess(value);
                                    if (value.length > 0) {
                                        // Filtrar bosses já tentados no minigame
                                        const filteredBosses = processedBosses
                                            .filter((b) => {
                                                // Buscar em todos os nomes disponíveis (inglês e português)
                                                const nameMatches = b.name
                                                    .toLowerCase()
                                                    .includes(
                                                        value.toLowerCase()
                                                    );
                                                const nameENMatches =
                                                    b.nameEN
                                                        ?.toLowerCase()
                                                        .includes(
                                                            value.toLowerCase()
                                                        ) || false;
                                                const namePTMatches =
                                                    b.namePT
                                                        ?.toLowerCase()
                                                        .includes(
                                                            value.toLowerCase()
                                                        ) || false;

                                                // Verificar se já foi usado este palpite no minigame
                                                const alreadyGuessed =
                                                    imageGuesses.some(
                                                        (guessName) =>
                                                            guessName.toLowerCase() ===
                                                                b.name.toLowerCase() ||
                                                            (b.nameEN &&
                                                                guessName.toLowerCase() ===
                                                                    b.nameEN.toLowerCase()) ||
                                                            (b.namePT &&
                                                                guessName.toLowerCase() ===
                                                                    b.namePT.toLowerCase())
                                                    );

                                                return (
                                                    (nameMatches ||
                                                        nameENMatches ||
                                                        namePTMatches) &&
                                                    !alreadyGuessed
                                                );
                                            })
                                            .slice(0, 5);

                                        // Transformar para incluir o objeto boss completo
                                        const suggestionItems =
                                            filteredBosses.map((boss) => ({
                                                name:
                                                    language === "PT" &&
                                                    boss.namePT
                                                        ? boss.namePT
                                                        : boss.name,
                                                boss: boss,
                                            }));

                                        setSuggestions(suggestionItems);
                                    } else {
                                        setSuggestions([]);
                                    }
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        if (suggestions.length > 0) {
                                            handleImageGuess(
                                                suggestions[0].name
                                            );
                                        } else if (guess) {
                                            handleImageGuess(guess);
                                        }
                                    }
                                }}
                                className="input"
                                placeholder={
                                    language === "PT"
                                        ? "Digite o nome do chefe..."
                                        : "Enter boss name..."
                                }
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestions">
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.name}
                                            className="suggestion-item flex items-center p-2"
                                            onClick={() => {
                                                setGuess(suggestion.name);
                                                setSuggestions([]);
                                                handleImageGuess(
                                                    suggestion.name
                                                );
                                            }}
                                        >
                                            <img
                                                src={suggestion.boss.image}
                                                alt={suggestion.name}
                                                className="w-8 h-8 mr-2 rounded-full object-cover border border-gray-700 shadow-sm"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        getGameImage(
                                                            suggestion.boss.game
                                                        );
                                                }}
                                            />
                                            <span>{suggestion.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                onClick={() => handleImageGuess(guess)}
                                className="button mt-3"
                            >
                                {language === "PT"
                                    ? "Enviar Palpite"
                                    : "Submit Guess"}
                            </button>
                        </div>
                    )}

                    {/* Lista de palpites */}
                    {imageGuesses.length > 0 && (
                        <div className="mt-4 mb-4">
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">
                                {language === "PT"
                                    ? "Palpites anteriores:"
                                    : "Previous guesses:"}
                            </h3>
                            <ul className="bg-gray-800 rounded-lg p-3 divide-y divide-gray-700 shadow-inner">
                                {[...imageGuesses]
                                    .reverse()
                                    .map((guessName, index) => (
                                        <li
                                            key={index}
                                            className={`py-2 px-1 ${
                                                index === 0
                                                    ? "text-yellow-300 font-semibold"
                                                    : "text-gray-300"
                                            } flex items-center`}
                                        >
                                            <span className="inline-block w-5 text-right mr-2 text-gray-500">
                                                {imageGuesses.length - index}.
                                            </span>
                                            {guessName}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {/* Resultado do jogo */}
                    {imageGameOver && (
                        <div className="mt-6 text-center">
                            {imageGameWon ? (
                                <p className="text-2xl text-green-500">
                                    {language === "PT"
                                        ? `Parabéns! Você acertou: ${imageBoss?.name}`
                                        : `Congratulations! You got it right: ${imageBoss?.name}`}
                                </p>
                            ) : (
                                <p className="text-2xl text-red-500">
                                    {language === "PT"
                                        ? `Você não acertou! O chefe era: ${imageBoss?.name}`
                                        : `You didn't get it! The boss was: ${imageBoss?.name}`}
                                </p>
                            )}

                            {imageBoss && (
                                <img
                                    src={imageBoss.image}
                                    alt={imageBoss.name}
                                    className="mx-auto mt-4 max-w-xs rounded-lg shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.src = getGameImage(
                                            imageBoss.game
                                        );
                                    }}
                                />
                            )}

                            <div className="flex gap-2 justify-center mt-4">
                                <button
                                    onClick={handleStartImageGame}
                                    className="button"
                                >
                                    {language === "PT"
                                        ? "Jogar Novamente"
                                        : "Play Again"}
                                </button>
                                <button
                                    onClick={handleGoBack}
                                    className="button"
                                >
                                    {language === "PT" ? "Voltar" : "Go Back"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Welcome Modal */}
                    {showWelcomeModal && (
                        <WelcomeModal
                            onClose={handleCloseWelcomeModal}
                            language={language}
                            isEldenMode={false}
                        />
                    )}

                    {/* Bug Report Modal */}
                    {showBugReportModal && (
                        <BugReportModal
                            onClose={handleCloseBugReportModal}
                            language={language}
                        />
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    if (gameOver && won && !viewMode) {
        return (
            <div className="flex flex-col items-center min-h-screen justify-between">
                <NavbarWithHandlers />
                <div className="card">
                    <h1 className="title">Dark Souls Bossdle</h1>
                    {previousBoss && (
                        <p className="text-sm mb-2 text-center text-gray-400">
                            Chefe do dia anterior: {previousBoss}
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
                        src={correctBoss.image}
                        alt={correctBoss.name}
                        className="mx-auto mt-4 max-w-xs rounded-lg shadow-md"
                        onError={(e) => {
                            e.currentTarget.src = getGameImage(
                                correctBoss.game
                            );
                        }}
                    />
                    <p className="mt-4 text-center text-gray-300">
                        Volte amanhã para um novo desafio!
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        <button
                            onClick={handleViewInitialPage}
                            className="button"
                        >
                            Ver Estado Atual
                        </button>
                        <button
                            onClick={handleStartImageGame}
                            className="button"
                        >
                            {language === "PT"
                                ? "Adivinhe o Chefe pela Imagem"
                                : "Guess the Boss by Image"}
                        </button>
                    </div>

                    {/* Welcome Modal */}
                    {showWelcomeModal && (
                        <WelcomeModal
                            onClose={handleCloseWelcomeModal}
                            language={language}
                            isEldenMode={false}
                        />
                    )}

                    {/* Bug Report Modal */}
                    {showBugReportModal && (
                        <BugReportModal
                            onClose={handleCloseBugReportModal}
                            language={language}
                        />
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen justify-between">
            <NavbarWithHandlers />
            <div className="card">
                <h1 className="title">Dark Souls Bossdle</h1>
                {previousBoss && (
                    <p className="text-sm mb-2 text-center text-gray-400">
                        Chefe do dia anterior: {previousBoss}
                    </p>
                )}
                <p className="text-center mb-4 text-gray-300">
                    {language === "PT"
                        ? "Adivinhe o chefe de Dark Souls do dia!"
                        : "Guess the Dark Souls boss of the day!"}
                </p>

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
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.name}
                                    className="suggestion-item flex items-center p-2"
                                    onClick={() => {
                                        setGuess(suggestion.name);
                                        setSuggestions([]);
                                        handleGuess(suggestion.name);
                                    }}
                                >
                                    <img
                                        src={suggestion.boss.image}
                                        alt={suggestion.name}
                                        className="w-8 h-8 mr-2 rounded-full object-cover border border-gray-700 shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.src = getGameImage(
                                                suggestion.boss.game
                                            );
                                        }}
                                    />
                                    <span>{suggestion.name}</span>
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
                                    src={correctBoss.image}
                                    alt={correctBoss.name}
                                    className="mx-auto mt-4 max-w-xs rounded-lg shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.src = getGameImage(
                                            correctBoss.game
                                        );
                                    }}
                                />
                            </>
                        )}
                        <p className="mt-4 text-gray-300">
                            {language === "PT"
                                ? "Volte amanhã para um novo desafio!"
                                : "Come back tomorrow for a new challenge!"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            <button
                                onClick={handleViewInitialPage}
                                className="button"
                            >
                                {language === "PT"
                                    ? "Ver Estado Atual"
                                    : "View Current State"}
                            </button>
                            <button
                                onClick={handleStartImageGame}
                                className="button"
                            >
                                {language === "PT"
                                    ? "Adivinhe o Chefe pela Imagem"
                                    : "Guess the Boss by Image"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Welcome Modal */}
                {showWelcomeModal && (
                    <WelcomeModal
                        onClose={handleCloseWelcomeModal}
                        language={language}
                        isEldenMode={false}
                    />
                )}

                {/* Bug Report Modal */}
                {showBugReportModal && (
                    <BugReportModal
                        onClose={handleCloseBugReportModal}
                        language={language}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default App;
