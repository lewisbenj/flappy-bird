# 🐦 Hyper-Difficult Flappy Bird (Siêu Khó) 🐦

A classic game with an **extreme twist**! This version of Flappy Bird is designed to be **hyper-difficult** (`CHẾ ĐỘ SIÊU KHÓ`), featuring faster movement, tighter gaps, stronger gravity, and dynamically moving pipes.

Accept the challenge and see how high a score you can achieve! Good luck—you'll definitely need it 😈.

## 🕹️ Live Demo

You can try the game out for yourself here: **[Insert Your Live Demo Link Here]**

## ✨ Key Features

This game takes the core Flappy Bird mechanics and turns the difficulty dial up to eleven:

* **⚠️ Increased Gravity & Jump:** Features stronger gravity (`bird.gravity: 0.7`) and a powerful jump force (`bird.jump: -12`), making control extremely challenging.
* **Faster Speed:** The pipes scroll at a high speed (`pipeSpeed = 4`) for relentless pressure.
* **Tighter Gaps:** The vertical gap between pipe segments is narrow (`pipeGap = 140`).
* **Dynamic, Oscillating Pipes:** The obstacles move up and down (oscillating by `30` pixels), turning the safe flight path into a moving target.
* **Personal High Score:** High scores are saved locally using `localStorage`.
* **Vibrant Retro Graphics:** Custom CSS and Canvas drawing create an engaging, arcade-like look with **Bounce** and **Pulse** animations.
* **Localization:** Fully localized in Vietnamese (`vi`).

## ⚙️ Technical Details

The game is built using a simple, modern web stack:

* **HTML5**
* **CSS3**
* **JavaScript (Canvas API)**

### Key Difficulty Parameters (from `script.js`):

| Variable | Value | Effect on Gameplay |
| :--- | :--- | :--- |
| `pipeSpeed` | `4` | Controls horizontal pipe movement speed. |
| `pipeGap` | `140` | The vertical space between the top and bottom pipe segments. |
| `bird.gravity` | `0.7` | The acceleration of the bird downwards. |
| `pipeInterval` | `90` | How frequently new pipes are spawned (more frequent). |

## 🚀 How to Run Locally

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/lewisbenj/flappy-bird.git
    cd hyper-difficult-flappy-bird
    ```
2.  **Open `index.html`:** Simply open the `index.html` file in your web browser (Chrome, Firefox, etc.).
3.  **Play!** Click/Tap the screen or press the **Spacebar** to make the bird jump.

## 🤝 Contributing

Contributions are welcome! If you have ideas for making this game even *more* difficult, improving the graphics, or refactoring the code, please feel free to submit a Pull Request.

