const game = (() => {
    let _board = [['', '', ''], ['', '', ''], ['', '', '']];
    let _players = [];
    let _turn = 0;

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

    const _saveNames = () => {
        localStorage.setItem('players', JSON.stringify([_players[0].name, _players[1].name]));
    }

    const setPlayerName = (id, name) => {
        _players[id-1].name = name;
        _saveNames();
    }

    const updateGame = (row, col) => {
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

    const init = () => {
        inputHandler.init();
        let board = [['', '', ''], ['', '', ''], ['', '', '']];
        let player1 = Player('player1', 'X');
        let player2 = Player('player2', 'O');

        let storedNames = JSON.parse(localStorage.getItem('players'));
        if (storedNames != null) {
            player1.name = storedNames[0];
            player2.name = storedNames[1];
        }
        
        _players = [player1, player2];
        _saveNames();
        _board = board;
        displayController.updatePlayers(_players);
        displayController.updateBoard(_board);
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
        restart,
        updateGame,
        setPlayerName
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

const inputHandler = (() => {

    let _cellElements = document.querySelectorAll('.cell');
    let _restartbuttons = document.querySelectorAll('.restart-btn');
    let _playerNameInputs = document.querySelectorAll('.player-name');

    const _handleCellClick = (e) => {
        e.stopPropagation();
        let row = e.target.className.replace(/\D/g, '')[0];
        let col = e.target.className.replace(/\D/g, '')[1];
        if( e.target.textContent != '') {
            return;
        }
        game.updateGame(row, col);
    };

    const _handleRestartClick = (e) => {
        e.stopPropagation();
        game.restart();
    }

    const _handlePlayerNameChange = (e) => {
        let playerId = e.target.id.replace(/\D/g, '');
        game.setPlayerName(playerId, e.target.value);
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
    }

    return {
        init
    }

})();

const displayController = (() => {
    let _gameOverModal = document.querySelector('.modal.game-over');
    let _gameOverModalMsg = document.querySelector('.modal .msg');

    const updateBoard = (board) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let cell = document.querySelector('.cell.row-' + i + '.col-' + j);
                cell.textContent = board[i][j];                
            }
        }
    };

    const updatePlayers = (players) => {
        document.querySelector('#name-player1').value = players[0].name;
        document.querySelector('#name-player2').value = players[1].name;
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
        updatePlayers,
        showGameOverScreen,
        hideGameOverScreen
    };
})();

game.init();