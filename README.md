# 1945

Shoot-em-up vertical original (vista de cima), no clima dos fliperamas de avião dos anos 80. Nomes, história, arte e sons são **próprios** — nada de marcas de terceiros. Tudo em português do Brasil.

**Jogar online:** [https://kt3746.github.io/1945/](https://kt3746.github.io/1945/)

> *Domine o céu. Sobreviva às ondas.*

## História

O Arquipélago de Vértice virou rota de guerra. A **Frota Crepúsculo** cobre o mar com asas de ferro. Você pilota o **Falcão-Vértice**, último caça da **Esquadrilha Horizonte**.

Cinco estágios — Mar de Vidro, Arquipélago Cinza, Estreito de Bronze, Cânion de Nuvens e Fortaleza do Horizonte. Depois o céu recomeça mais duro.

## Como jogar

1. O cenário sobe sozinho. Seu avião fica na parte de baixo e atira **para cima**.
2. Desvie de aviões e tiros. A área que toma dano é menor que o desenho do avião.
3. Depois de um hit você fica invencível por um instante — use para se reposicionar.
4. Inimigos dourados (o **Ás**) soltam bônus.
5. Chefes avisam o ataque (brilho e linha). Bomba limpa tiros inimigos e fere tudo na tela.
6. Se as três vidas acabarem, é fim de jogo. O recorde fica salvo neste aparelho.

### Bônus

| Nome | Efeito |
| --- | --- |
| TIRO+ | Tiro mais largo (e visível no chão) |
| Leque | Tiro em leque |
| Rajada | Tiro mais rápido |
| Escudo | Absorve um hit |
| Bomba | +1 bomba |
| Medalha | +1000 pontos |

## Controles

### Computador

| Tecla | Ação |
| --- | --- |
| Setas ou `WASD` | Mover |
| `Espaço` ou `Z` | Atirar (segure) |
| `Shift` ou `C` | Foco (voa mais devagar, vê o ponto frágil) |
| `X` | Bomba |
| `P` ou `Esc` | Pausar |

### Celular

Stick à esquerda para voar. **Fogo**, **Bomba** e **Foco** à direita. O primeiro toque também liga o som.

## Som e recorde

- Botão **Som** silencia ou ativa. A escolha fica salva neste aparelho.
- Efeitos e a música de fundo são tons criados no navegador (Web Audio), sem faixas prontas.
- O recorde fica no próprio navegador (`localStorage`).

## Jogar neste computador

Não precisa instalar nada além de um navegador.

```bash
python3 -m http.server 4173
```

Abra [http://localhost:4173](http://localhost:4173).

Para checar a lógica de colisão e pontos:

```bash
npm test
```

## Arquivos

- `index.html` — tela, HUD e textos
- `css/styles.css` — visual
- `js/core.js` — regras puras (colisões, pontos)
- `js/game.js` — ondas, chefes, tiros, bônus
- `js/stages.js` — os 5 estágios
- `js/sprites.js` — aviões desenhados no canvas
- `js/render.js` — mar, ilhas, nuvens, suco visual
- `js/particles.js` — explosões, rastros, combo
- `js/input.js` — teclado e toque
- `js/audio.js` — sons
- `js/ui.js` — telas (título, pausa, vitória, fim)
- `js/main.js` — liga o loop a 60 fps

Site estático para GitHub Pages (pasta raiz, branch `main`). A constante `VERSION` em `js/version.js` é a fonte da verdade: título, rodapé e todos os `?v=` do HTML devem mostrar o mesmo número (agora **1.2.0**).
