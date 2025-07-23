document.getElementById('addPlayerButton').addEventListener('click', addPlayer);
document.getElementById('startGameButton').addEventListener('click', startGame);
document.getElementById('aggregateButton').addEventListener('click', goToAggregatePage); // 集計ボタンのイベント追加

function addPlayer() {
    const input = document.getElementById('playerInput');
    const playerList = document.getElementById('playerList');
    const playerName = input.value.trim();

    if (playerName) {
        const listItem = document.createElement('li');
        listItem.textContent = playerName;
        playerList.appendChild(listItem);
        
        let players = JSON.parse(localStorage.getItem('players')) || [];
        players.push(playerName);
        localStorage.setItem('players', JSON.stringify(players));
        
        input.value = ''; 
    } else {
        alert('プレイヤー名を入力してください');
    }
}

function startGame() {
    const players = [];
    const playerListItems = document.querySelectorAll('#playerList li');

    playerListItems.forEach(item => {
        players.push(item.textContent);
    });

    localStorage.setItem('players', JSON.stringify(players));
    window.location.href = 'game.html';
}

function goToAggregatePage() {
    window.location.href = 'aggregate.html'; // 集計ページに遷移
}