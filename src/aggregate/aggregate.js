async function fetchScores() {
    const files = [
        '../date/score_2025-07-01.json',
        '../date/score_2025-08-05.json'
    ];
    let aggregatedData = {};
    
    for (const file of files) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${file}`);
            }

            const data = await response.json();

            // 最初のエントリを無視して、スコア処理を行う
            data.slice(1).forEach(entry => {
                if (entry.scores) {
                    const scores = entry.scores;
                    for (const name in scores) {
                        if (!aggregatedData[name]) {
                            aggregatedData[name] = { total: 0, count: 0 };
                        }
                        aggregatedData[name].total += scores[name];
                        aggregatedData[name].count++;
                    }
                }
            });
        } catch (error) {
            console.error(`Error fetching the ${file}: `, error);
        }
    }

    // テーブルにデータを追加
    const tbody = document.getElementById('results-tbody');
    for (const name in aggregatedData) {
        const { total, count } = aggregatedData[name];
        const winRate = (total / count) * 100; // 仮に合計値で勝率を計算
        const avgRank = (total / count).toFixed(2); // 平均着順計算

        const row = `
            <tr>
                <td>${name}</td>
                <td>${total}</td>
                <td>${count}</td>
                <td>${winRate.toFixed(2)}%</td>
                <td>${avgRank}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
}

window.onload = fetchScores;