// game.js

// グローバルなプレイヤー数を定義
const playerCount = 4;

// ローカルストレージからプレイヤーリストを取得
const players = JSON.parse(localStorage.getItem('players'));
const gamePlayerList = document.getElementById('gamePlayerList');

if (players && players.length > 0) {
    players.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        gamePlayerList.appendChild(listItem);

        // プレイヤーの名前をスコアテーブルに設定
        const playerNameElement = document.getElementById(`player${index + 1}Name`);
        if (playerNameElement) {
            playerNameElement.textContent = player; // 名前をテーブルに設定
        }
    });
} else {
    const listItem = document.createElement('li');
    listItem.textContent = 'プレイヤーがいません';
    gamePlayerList.appendChild(listItem);
}

// 得点が変更された時に合計を計算する関数
function calculateScores() {
    const totalScores = [];

    // 各プレイヤーの得点を取得
    document.querySelectorAll('#pointsBody tr').forEach(row => {
        const input = row.querySelector('td:first-child input'); // 得点用の入力フィールド
        totalScores.push(Number(input.value) || 0); // 各プレイヤーの得点を配列に追加
    });

    // 合計を取得して表示する
    const totalDisplay = totalScores.reduce((sum, score) => sum + score, 0);
    console.log("合計得点:", totalDisplay); // 合計をコンソールに表示 (必要に応じて別の表示方法に変更)
}

// 入力フィールドに変化があった場合に合計を計算
document.getElementById('pointsBody').addEventListener('input', calculateScores);

// 戻るボタンの動作
document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'index.html'; // プレイヤー登録ページに戻る
});

// 初期合計を設定（全て0で初期化）
calculateScores();

// 入力フィールドにイベントリスナーを追加
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateScores);
});

// 得点を集計する関数
function calculateScores() {
    const totalScores = [0, 0, 0, 0];

    // 各行の得点を集計
    document.querySelectorAll('#pointsBody tr').forEach(row => {
        const inputs = row.querySelectorAll('input');
        
        totalScores[0] += Number(inputs[0].value) || 0; // プレイヤー1
        totalScores[1] += Number(inputs[1].value) || 0; // プレイヤー2
        totalScores[2] += Number(inputs[2].value) || 0; // プレイヤー3
        totalScores[3] += Number(inputs[3].value) || 0; // プレイヤー4
    });

    // 合計を表示
    document.getElementById('totalScore1').textContent = totalScores[0] === 0 ? '-' : totalScores[0];
    document.getElementById('totalScore2').textContent = totalScores[1] === 0 ? '-' : totalScores[1];
    document.getElementById('totalScore3').textContent = totalScores[2] === 0 ? '-' : totalScores[2];
    document.getElementById('totalScore4').textContent = totalScores[3] === 0 ? '-' : totalScores[3];
}

// 行削除機能
document.getElementById('pointsBody').addEventListener('click', function(e) {
    if (e.target.classList.contains('removeRow')) {
        const row = e.target.closest('tr');
        row.remove(); // 行を削除
        calculateScores(); // 得点再計算
    }
});

// 新しい行追加機能（必要であれば）
document.getElementById('addRowButton').addEventListener('click', function() {
    const pointsBody = document.getElementById('pointsBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="number" placeholder="" /></td>
        <td><input type="number" placeholder="" /></td>
        <td><input type="number" placeholder="" /></td>
        <td><input type="number" placeholder="" /></td>
        <td><button class="removeRow">削除</button></td>
    `;
    pointsBody.appendChild(newRow);
    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateScores);
    });
});

// 計算ボタンの動作
document.getElementById('calculateButton').addEventListener('click', function() {
    const now = new Date();
    const date = now.toLocaleDateString(); // 今日の日付を取得
    const players = JSON.parse(localStorage.getItem('players')) || [];
    
    // プレイヤー名の準備
    const playerNames = players.length > 0 ? players : ["プレイヤー1", "プレイヤー2", "プレイヤー3", "プレイヤー4"];
    
    // 結果を収集する配列
    const results = [];
    // 各プレイヤーの合計を保持するオブジェクト
    const finalScores = {};
    playerNames.forEach(name => finalScores[name] = 0);

    let roundCount = 1; // 回戦数のカウンタ

    // 各行のスコアを収集
    document.querySelectorAll('#pointsBody tr').forEach(row => {
        const inputs = row.querySelectorAll('input');
        const playerScores = Array.from(inputs).map(input => Number(input.value) || 0);
        
        const dataRow = {
            date: date,
            Count: roundCount.toString(), // 現在の回戦数を追加
            scores: {}
        };
        
        playerNames.forEach((name, index) => {
            dataRow.scores[name] = playerScores[index];
            finalScores[name] += playerScores[index]; // 各プレイヤーの合計更新
        });

        results.push(dataRow);
        roundCount++; // 回戦数をインクリメント
    });

    // 最終合計を追加
    results.push({
        date: "最終合計",
        total: finalScores
    });

    // 最初のヘッダー行を追加
    results.unshift(["日程", "何回戦", ...playerNames]);

    // JSONに変換
    const jsonContent = JSON.stringify(results, null, 2);

    // 日付を YYYY-MM-DD 形式にフォーマット
    const formattedDate = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    
    // JSONのURIをエンコード
    const encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonContent);
    
    // JSONファイルをダウンロードするためのリンクを作成
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `score_${formattedDate}.json`); // ファイル名を指定
    
    document.body.appendChild(link);
    link.click(); // リンクを自動的にクリックしてダウンロード
    document.body.removeChild(link); // リンクを削除
});