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
        console.error("Fel vid laddning av leaderboard:", error);
    }
}

async function loadMatches() {
    try {
        const response = await fetch("matches.json");
        const matches = await response.json();

        const container = document.getElementById("matches-container");

        if (!container) return;

        container.innerHTML = "";

        matches.forEach(match => {

            const div = document.createElement("div");

            div.className = "match";

            div.innerHTML = `
                <strong>${match.home} - ${match.away}</strong><br>
                Datum: ${match.date}<br>
                Status: ${match.status}<br>
                Resultat: ${match.result ?? "-"}
            `;

            container.appendChild(div);

        });

    } catch (error) {
        console.error("Fel vid laddning av matcher:", error);
    }
}

loadLeaderboard();
loadMatches();
