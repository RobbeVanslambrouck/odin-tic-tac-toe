const game = (() => {
    let _board = [['', '', ''], ['', '', ''], ['', '', '']];
    let _players = [];
    let _turn = 0;
    let _cellElements = document.querySelectorAll('.cell');
    let _restartbuttons = document.querySelectorAll('.restart-btn');
    let _playerNameInputs = document.querySelectorAll('.player-name');

    const _isGameWon = (row, col) => {
        return _checkRow(row) || _checkCow(col) || _checkDiagonal(row, col) 
    };

    const _isGameTie = () => {
        for (let i = 0; i < _board.length; i++) {
            for (let j = 0; j < _board[i].length; j++) {
                if (_emptyCell(i, j) || _isGameWon(i, j)) {
                    return false;
                }
            }
        }
        return true;
    };

    const _checkRow = (row) => {
        return _board[row].join('').search(/XXX|OOO/) !== -1;
    };
    const _checkCow = (col) => {
        let c = '';
        for (let i = 0; i < _board.length; i++) {
            c += _board[i][col];
        }
        return c.search(/XXX|OOO/) !== -1;
    };
    const _checkDiagonal = (row, col) => {
        if ((row + col) % 2 === 1) {
            return false;
        }
        let d = ['', ''];
        for (let i = 0; i < _board.length; i++) {
            d[0] += _board[i][i];
            d[1] += _board[i][_board.length - 1 - i];
        }
        return d[0].search(/XXX|OOO/) !== -1 || d[1].search(/XXX|OOO/) !== -1;
    };

    const _emptyCell = (row, col) => {
        return _board[row][col] === '';
    }

    const _updateGame = (row, col) => {
        _board = _players[_turn].turn(row, col, _board);
        displayController.updateBoard(_board);
        if (_isGameWon(row, col)) {
            displayController.showGameOverScreen(_players[_turn].name + ' wins');
        }
        if (_isGameTie()) {
            displayController.showGameOverScreen('it\'s a tie');
        }
        _turn = ++_turn % 2;
    }

    const _handleCellClick = (e) => {
        e.stopPropagation();
        let cellNumber = e.target.id.charAt(5);
        let row = Math.floor(cellNumber / 3);
        let col = cellNumber % 3;
        if( !_emptyCell(row, col)) {
            return;
        }
        _updateGame(row, col);
    };

    const _handleRestartClick = (e) => {
        e.stopPropagation();
        restart();
    }

    const _handlePlayerNameChange = (e) => {
        let playerId = e.target.id.charAt(11) - 1;
        _players[playerId].name = e.target.value;
        localStorage.setItem('players', JSON.stringify([_players[0].name, _players[1].name]));
    };

    const init = () => {
        _cellElements.forEach( cell => {
            cell.addEventListener('click', _handleCellClick);
        });

        _restartbuttons.forEach( btn => {
            btn.addEventListener('click', _handleRestartClick);
        });

        _playerNameInputs.forEach( input => {
            input.addEventListener('keyup', _handlePlayerNameChange);
        });
        
        let board = [['', '', ''], ['', '', ''], ['', '', '']];

        let player1 = Player('player1', 'X');
        let player2 = Player('player2', 'O');
        let playerNames = JSON.parse(localStorage.getItem('players'));
        if (playerNames === null) {
            localStorage.setItem('players', JSON.stringify([player1.name, player2.name]));
        } else {
            player1.name = playerNames[0];
            player2.name = playerNames[1];
        }

        document.querySelector('#name-player1').value = player1.name
        document.querySelector('#name-player2').value = player2.name
        _players = [player1, player2];
        _board = board;
    };

    const restart = () => {
        let board = [['', '', ''], ['', '', ''], ['', '', '']];
        _board = board;
        _turn = 0;
        displayController.updateBoard(_board);
        displayController.hideGameOverScreen();
    }

    return {
        init,
        restart
    }

})();

const Player = (name, symbol) => {
    const getSymbol = () => symbol;
    const turn = (row, col, board) => {
        board[row][col] = symbol
        return board;
    }

    return {
        name,
        symbol,
        getSymbol,
        turn
    }
}

const gameboard = (() => {
    let _board = [];
    const getBoard = () => {return _board}
});

const displayController = (() => {
    let _boardElement = document.querySelector('.game-board');
    let _gameOverModal = document.querySelector('.modal.game-over');
    let _gameOverModalMsg = document.querySelector('.modal .msg');

    const _changeCelltext = (cell, text) => {
        let cellElement = document.querySelector(('#cell-' + cell));
        cellElement.textContent = text;
    };

    const updateBoard = (board) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let cell = document.querySelector('.cell.row-' + i + '.col-' + j);
                cell.textContent = board[i][j];                
            }
        }
    };

    const showGameOverScreen = (msg = 'game has ended') => {
        _gameOverModal.className = _gameOverModal.className.replace(' hidden', '');
        _gameOverModalMsg.textContent = msg;
    };

    const hideGameOverScreen = () => {
        _gameOverModal.className += ' hidden';
    };


    return {
        updateBoard,
        showGameOverScreen,
        hideGameOverScreen
    };
})();

game.init();