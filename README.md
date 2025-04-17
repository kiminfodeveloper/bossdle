# Bossdle

Um jogo de adivinhação de chefes da série Dark Souls, inspirado no Wordle.

![Dark Souls Bossdle](https://bossdle.vercel.app/imgs/default.png)

## Funcionalidades

-   **Novo Chefe Diário**: A cada dia, um novo chefe da série Dark Souls é escolhido aleatoriamente.
-   **Resets Automáticos**: O chefe do dia é resetado automaticamente às 6h da manhã no horário de Brasília.
-   **Tentativas Ilimitadas**: Você pode tentar adivinhar quantas vezes quiser até acertar o chefe do dia.
-   **Contador de Tentativas**: Um contador exibe quantas tentativas você já fez durante o jogo.
-   **Sistema de Dicas**: Cada palpite mostra dicas coloridas, indicando:
    -   Verde: Acertou a característica (jogo, localização, etc.)
    -   Amarelo: Parcialmente correto
    -   Vermelho: Incorreto
-   **Auto-completar**: Ao digitar, o jogo sugere nomes de chefes para facilitar a escolha.
-   **Estado Persistente**: O jogo salva seu progresso localmente, permitindo continuar de onde parou.
-   **Design Responsivo**: Interface adaptável para desktop e dispositivos móveis.
-   **Imagens de Jogos**: Exibe os ícones dos jogos correspondentes aos chefes.

## Tecnologias Utilizadas

-   React com TypeScript
-   Vite como bundler
-   Tailwind CSS para estilos
-   LocalStorage para persistência de dados

## Como Jogar

1. Digite o nome de um chefe da série Dark Souls na barra de busca.
2. Selecione um chefe das sugestões ou termine de digitar o nome.
3. Clique em "Enviar Palpite" ou pressione Enter.
4. Analise as dicas coloridas para fazer seu próximo palpite:
    - **Chefe**: Nome do chefe que você tentou
    - **Jogo**: Em qual jogo da série esse chefe aparece
    - **Localização**: Onde encontrar o chefe no jogo
    - **DLC?**: Se o chefe faz parte de conteúdo adicional
    - **Opcional?**: Se o chefe é opcional ou obrigatório
    - **Drop de Alma**: Item especial obtido ao derrotar o chefe
5. Continue adivinhando até acertar o chefe do dia!

## Jogar Online

Você pode jogar o Bossdle online em:
[https://bossdle.vercel.app/](https://bossdle.vercel.app/)

## Instalação e Execução Local

```bash
# Clone o repositório
git clone https://github.com/kiminfodeveloper/bossdle.git

# Entre no diretório
cd bossdle

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
```

## Futuras Implementações

-   Contador de acertos em tempo real
-   Estatísticas de jogadores
-   Modo de jogo temático
-   Suporte a outros idiomas

## Autor

-   **Kim Developer** - [GitHub](https://github.com/kiminfodeveloper)

## Redes Sociais

-   [YouTube](https://www.youtube.com/@lovem0n3y16)
-   [TikTok](https://www.tiktok.com/@lovem0n3y16)
-   [Instagram](https://www.instagram.com/lovem0n3y16.ofc/)
-   [GitHub](https://github.com/kiminfodeveloper)
-   [Loja](https://kiminfotec-store.vercel.app/)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
