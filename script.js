const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        function resizeCanvas() {
            const container = document.getElementById('gameContainer');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Game variables
        let gameActive = false;
        let gameStarted = false;
        let score = 0;
        let highScore = localStorage.getItem('flappyHighScore') || 0;
        document.getElementById('highScore').textContent = 'Kỷ lục: ' + highScore;

        // Bird
        const bird = {
            x: 100,
            y: canvas.height / 2,
            width: 40,
            height: 35,
            velocity: 0,
            gravity: 0.7,  // Tăng trọng lực
            jump: -12,     // Lực nhảy mạnh hơn
            rotation: 0,
            color: '#FFD700'
        };

        // Pipes
        let pipes = [];
        const pipeWidth = 80;
        const pipeGap = 140;  // Khoảng trống 
        const pipeSpeed = 4;  // Tốc độ nhanh hơn
        let pipeTimer = 0;
        const pipeInterval = 90; // Ống xuất hiện 

        // Background elements
        let clouds = [];
        let groundX = 0;

        // Initialize clouds
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.3),
                width: 60 + Math.random() * 40,
                speed: 0.3 + Math.random() * 0.5
            });
        }

        function drawBird() {
            ctx.save();
            ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
            ctx.rotate(bird.rotation);

            // Body
            ctx.fillStyle = bird.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wing
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.ellipse(-5, 0, 15, 10, Math.sin(Date.now() * 0.01) * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Eye
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(10, -5, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(12, -5, 4, 0, Math.PI * 2);
            ctx.fill();

            // Beak
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(25, -3);
            ctx.lineTo(25, 3);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        function drawPipe(pipe) {
            // Pipe color gradient
            const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
            gradient.addColorStop(0, '#5cb85c');
            gradient.addColorStop(0.5, '#4cae4c');
            gradient.addColorStop(1, '#3d8b3d');

            ctx.fillStyle = gradient;
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
            ctx.strokeStyle = '#2d6b2d';
            ctx.lineWidth = 4;
            ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);

            ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, pipeWidth + 10, 30);
            ctx.strokeRect(pipe.x - 5, pipe.topHeight - 30, pipeWidth + 10, 30);

            ctx.fillStyle = gradient;
            ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height);
            ctx.strokeRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height);

            ctx.fillRect(pipe.x - 5, pipe.topHeight + pipeGap, pipeWidth + 10, 30);
            ctx.strokeRect(pipe.x - 5, pipe.topHeight + pipeGap, pipeWidth + 10, 30);
        }

        function drawClouds() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            clouds.forEach(cloud => {
                ctx.beginPath();
                ctx.arc(cloud.x, cloud.y, cloud.width / 3, 0, Math.PI * 2);
                ctx.arc(cloud.x + cloud.width / 3, cloud.y - 10, cloud.width / 2.5, 0, Math.PI * 2);
                ctx.arc(cloud.x + cloud.width / 1.5, cloud.y, cloud.width / 3, 0, Math.PI * 2);
                ctx.fill();

                cloud.x -= cloud.speed;
                if (cloud.x < -cloud.width) {
                    cloud.x = canvas.width + cloud.width;
                    cloud.y = Math.random() * (canvas.height * 0.3);
                }
            });
        }

        function drawGround() {
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

            ctx.fillStyle = '#D2691E';
            for (let i = 0; i < canvas.width / 40 + 1; i++) {
                const x = (i * 40 + groundX) % canvas.width;
                ctx.fillRect(x, canvas.height - 80, 35, 10);
                ctx.fillRect(x + 10, canvas.height - 60, 15, 10);
            }

            if (gameActive) {
                groundX -= pipeSpeed;
            }
        }

        function updateBird() {
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            bird.rotation = Math.min(Math.PI / 4, bird.velocity * 0.05);

            // Check boundaries
            if (bird.y + bird.height > canvas.height - 80) {
                gameOver();
            }
            if (bird.y < 0) {
                bird.y = 0;
                bird.velocity = 0;
            }
        }

        function updatePipes() {
            pipeTimer++;
            
            if (pipeTimer > pipeInterval) {
                const minHeight = 100;
                const maxHeight = canvas.height - pipeGap - 180;
                const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
                
                pipes.push({
                    x: canvas.width,
                    topHeight: topHeight,
                    baseTopHeight: topHeight, // Lưu chiều cao gốc
                    oscillation: Math.random() * Math.PI * 2, // Pha dao động ngẫu nhiên
                    scored: false
                });
                pipeTimer = 0;
            }

            pipes.forEach((pipe, index) => {
                pipe.x -= pipeSpeed;

                // Ống di chuyển lên xuống 
                pipe.oscillation += 0.03;
                pipe.topHeight = pipe.baseTopHeight + Math.sin(pipe.oscillation) * 30;

                // Score
                if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
                    score++;
                    pipe.scored = true;
                    document.getElementById('score').textContent = score;

                    // Update high score
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('flappyHighScore', highScore);
                        document.getElementById('highScore').textContent = 'Kỷ lục: ' + highScore;
                    }
                }

                if (
                    bird.x + bird.width > pipe.x &&
                    bird.x < pipe.x + pipeWidth &&
                    (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipeGap)
                ) {
                    gameOver();
                }

                if (pipe.x < -pipeWidth) {
                    pipes.splice(index, 1);
                }
            });
        }

        function jump() {
            if (!gameActive) return;
            
            if (!gameStarted) {
                gameStarted = true;
            }
            
            bird.velocity = bird.jump;
        }

        function startGame() {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('instructions').style.display = 'block';
            gameActive = true;
            gameStarted = false;
            score = 0;
            pipes = [];
            pipeTimer = 0;
            bird.y = canvas.height / 2;
            bird.velocity = 0;
            bird.rotation = 0;
            document.getElementById('score').textContent = '0';
        }

        function gameOver() {
            if (!gameActive) return;
            gameActive = false;
            document.getElementById('finalScore').textContent = score;
            document.getElementById('finalHighScore').textContent = highScore;
            document.getElementById('gameOverScreen').style.display = 'flex';
            document.getElementById('instructions').style.display = 'none';
        }

        function restartGame() {
            document.getElementById('gameOverScreen').style.display = 'none';
            startGame();
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawClouds();
            
            pipes.forEach(drawPipe);

            drawBird();

            drawGround();

            if (gameActive && gameStarted) {
                updateBird();
                updatePipes();
            }

            requestAnimationFrame(gameLoop);
        }

        // Event listeners
        canvas.addEventListener('click', jump);
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        });


        gameLoop();







//uocgicoaylacuatoi=)))
