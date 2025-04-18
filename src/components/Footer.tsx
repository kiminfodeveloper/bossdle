import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-300 text-center">
                    Gostou do Bossdle? Apoie o projeto com uma doação!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="https://livepix.gg/lovem0n3y16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-heart-fill text-red-400"></i> Doar
                    </a>
                    <a
                        href="https://github.com/kiminfodeveloper"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-github text-gray-200"></i> GitHub
                    </a>
                    <a
                        href="https://kiminfotec-store.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-cart3 text-blue-300"></i> Minha Loja
                    </a>
                </div>
            </div>

            {/* Redes Sociais */}
            <div className="mt-4 border-t border-gray-700 pt-4">
                <h3 className="text-gray-300 text-center mb-2">
                    Minhas Redes Sociais
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                    <a
                        href="https://www.youtube.com/@lovem0n3y16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-youtube text-red-500"></i> YouTube
                    </a>
                    <a
                        href="https://www.twitch.tv/lovem0n3y16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-twitch text-purple-400"></i> Twitch
                    </a>
                    <a
                        href="https://www.tiktok.com/@lovem0n3y16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-tiktok text-white"></i> TikTok
                    </a>
                    <a
                        href="https://www.instagram.com/lovem0n3y16.ofc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex items-center gap-2"
                    >
                        <i className="bi bi-instagram text-purple-500"></i>{" "}
                        Instagram
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
