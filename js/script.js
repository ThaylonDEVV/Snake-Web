document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const snake = document.getElementById('snake');
    const food = document.getElementById('food');
    const backgroundImage = document.createElement('img');
    backgroundImage.src = 'images/fundo.jpg';
    backgroundImage.style.position = 'absolute';
    backgroundImage.style.width = '100%';
    backgroundImage.style.height = '100%';
    gameContainer.appendChild(backgroundImage);

    let snakePosition = { x: 0, y: 0 };
    let snakeSegments = [{ x: 0, y: 0 }];
    let foodPosition = generateFoodPosition();
    let direction = 'right';
    let score = 0;
    let updateInterval = 110;

    function generateFoodPosition() {
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * 15) * 20,
                y: Math.floor(Math.random() * 15) * 20
            };
        } while (isFoodOnSnake(newFoodPosition));
        return newFoodPosition;
    }

    function isFoodOnSnake(position) {
        return snakeSegments.some(segment => segment.x === position.x && segment.y === position.y);
    }

    function createSnakeSegmentElement(index) {
        const snakeSegment = document.createElement('div');
        snakeSegment.style.position = 'absolute';
        snakeSegment.style.width = '20px';
        snakeSegment.style.height = '20px';
        snakeSegment.style.left = snakeSegments[index].x + 'px';
        snakeSegment.style.top = snakeSegments[index].y + 'px';
        snakeSegment.style.zIndex = '1';
        snakeSegment.classList.add('snake-segment');
        snakeSegment.id = 'snake-segment-' + index;
        gameContainer.appendChild(snakeSegment);
    }

    function updateSnakeSegments() {
        document.querySelectorAll('.snake-segment').forEach(segment => segment.remove());
        snakeSegments.forEach((segment, index) => {
            createSnakeSegmentElement(index);
        });
    }

    function update() {
        // Atualiza a posição da cobra com base na direção
        switch (direction) {
            case 'up':
                snakePosition.y -= 20;
                break;
            case 'down':
                snakePosition.y += 20;
                break;
            case 'left':
                snakePosition.x -= 20;
                break;
            case 'right':
                snakePosition.x += 20;
                break;
        }

        // Verifica colisão com as paredes
        if (snakePosition.x < 0 || snakePosition.x >= 500 || snakePosition.y < 0 || snakePosition.y >= 500) {
            endGame();
            return;
        }

        // Verifica colisão com a comida
        if (snakePosition.x === foodPosition.x && snakePosition.y === foodPosition.y) {
            score++;
            snakeSegments.push({ ...snakeSegments[snakeSegments.length - 1] });
            foodPosition = generateFoodPosition();
        }

        // Atualiza os segmentos da cobra
        for (let i = snakeSegments.length - 1; i > 0; i--) {
            snakeSegments[i] = { ...snakeSegments[i - 1] };
        }
        snakeSegments[0] = { ...snakePosition };

        // Atualiza a cobra e a comida na tela
        snake.style.left = snakePosition.x + 'px';
        snake.style.top = snakePosition.y + 'px';

        food.style.left = foodPosition.x + 'px';
        food.style.top = foodPosition.y + 'px';
        food.style.zIndex = '2';

        // Atualiza os elementos dos segmentos da cobra no DOM
        updateSnakeSegments();

        // Chama a próxima atualização após o intervalo especificado
        setTimeout(() => {
            requestAnimationFrame(update);
        }, updateInterval);
    }

    function endGame() {
        const playerName = prompt('Digite o seu nome:');
        alert(`Jogo encerrado!\nJogador: ${playerName}\nPontuação: ${score}`);

        const playAgain = confirm('Quer jogar novamente?');
        if (playAgain) {
            resetGame();
        }
    }

    function resetGame() {
        snakePosition = { x: 0, y: 0 };
        snakeSegments = [{ x: 0, y: 0 }];
        foodPosition = generateFoodPosition();
        direction = 'right';
        score = 0;

        update();
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (direction !== 'right') {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (direction !== 'left') {
                    direction = 'right';
                }
                break;
        }
    });

    // Inicia o jogo
    update();
});
