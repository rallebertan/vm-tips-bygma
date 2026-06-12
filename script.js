// =========================
// VM Tips Bygma 2026
// =========================

document.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();
    loadMatches();
    loadPredictions();
    loadNextMatch();
    loadStats();
});

// =========================
// LEADERBOARD
// =========================

async function loadLeaderboard() {
    try {

        const response = await fetch("leaderboard.json");
        const players = await response.json();

        const table = document.getElementById("leaderboard-body");

        if (!table) return;

        table.innerHTML = "";

        players.forEach(player => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${player.placering}</td>
                <td>${player.namn}</td>
                <td>${player.poang}</td>
                <td>${player.fulltraffar}</td>
                <td>${player.rattUtfall}</td>
            `;

            table.appendChild(row);

        });

    } catch (error) {
        console.error("Leaderboard-fel:", error);
    }
}

// =========================
// MATCHER
// =========================

async function loadMatches() {

    try {

        const response = await fetch("matches.json");
        const matches = await response.json();

        const container =
            document.getElementById("matches-container");

        if (!container) return;

        container.innerHTML = "";

        matches.forEach(match => {

            const div = document.createElement("div");

            div.className = "match";

            div.innerHTML = `
                <strong>${match.home} - ${match.away}</strong><br>
                📅 ${match.date}<br>
                📊 ${match.status}<br>
                ⚽ ${match.result ?? "-"}
            `;

            container.appendChild(div);

        });

    } catch (error) {
        console.error("Match-fel:", error);
    }

}

// =========================
// ALLAS TIPS
// =========================

async function loadPredictions() {

    try {

        const response =
            await fetch("predictions.json");

        const data = await response.json();

        const container =
            document.getElementById("predictions-container");

        if (!container) return;

        container.innerHTML = "";

        Object.keys(data).forEach(matchName => {

            const card = document.createElement("div");

            card.className = "match";

            let html =
                `<h3>👀 ${matchName}</h3>`;

            data[matchName].forEach(prediction => {

                html += `
                    <p>
                    <strong>${prediction.namn}</strong>
                    → ${prediction.tips}
                    </p>
                `;

            });

            card.innerHTML = html;

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Predictions-fel:", error);

    }

}

// =========================
// NÄSTA MATCH
// =========================

async function loadNextMatch() {

    try {

        const response =
            await fetch("nextmatch.json");

        const nextMatch =
            await response.json();

        const container =
            document.getElementById("next-match-container");

        if (!container) return;

        container.innerHTML = `

        <div class="match">

            <h3>
                ${nextMatch.home}
                -
                ${nextMatch.away}
            </h3>

            <p>
                📅 ${nextMatch.date}
            </p>

            <p>
                🕘 ${nextMatch.time}
                (${nextMatch.timezone})
            </p>

            <hr>

            <p>
                🇨🇦/🏠 Vinst:
                ${nextMatch.majority.homeWin}
            </p>

            <p>
                🤝 Kryss:
                ${nextMatch.majority.draw}
            </p>

            <p>
                🇧🇦/✈️ Vinst:
                ${nextMatch.majority.awayWin}
            </p>

        </div>

        `;

    } catch (error) {

        console.error("Next Match-fel:", error);

    }

}

// =========================
// STATISTIK
// =========================

async function loadStats() {

    try {

        const response =
            await fetch("stats.json");

        const stats =
            await response.json();

        const container =
            document.getElementById("stats-container");

        if (!container) return;

        container.innerHTML = `

            <p>
            🥇 Ledare:
            ${stats.leader.name}
            (${stats.leader.points}p)
            </p>

            <p>
            ⚽ Flest fullträffar:
            ${stats.mostExactResults.name}
            (${stats.mostExactResults.count})
            </p>

            <p>
            🎯 Mest vågad:
            ${stats.mostRisky.name}
            </p>

            <p>
            👥 Deltagare:
            ${stats.participants}
            </p>

            <p>
            🏟 Matcher spelade:
            ${stats.matchesPlayed}
            </p>

        `;

    } catch (error) {

        console.error("Stats-fel:", error);

    }

}
