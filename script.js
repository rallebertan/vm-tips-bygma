// =====================================
// VM Tips Bygma 2026
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();
    loadMatches();
    loadPredictions();
    loadNextMatch();
    loadStats();
});

// =====================================
// LEADERBOARD
// =====================================

async function loadLeaderboard() {

    try {

        const response =
            await fetch("leaderboard.json");

        const players =
            await response.json();

        const table =
            document.getElementById("leaderboard-body");

        if (!table) return;

        table.innerHTML = "";

        players.forEach(player => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${player.placering}</td>
                <td>${player.namn}</td>
                <td>${player.poang}</td>
                <td>${player.fulltraffar}</td>
                <td>${player.rattUtfall}</td>
            `;

            table.appendChild(row);

        });

    } catch(error) {

        console.error(
            "Fel vid laddning av leaderboard",
            error
        );

    }

}

// =====================================
// MATCHER
// =====================================

async function loadMatches() {

    try {

        const response =
            await fetch("matches.json");

        const matches =
            await response.json();

        const container =
            document.getElementById("matches-container");

        if (!container) return;

        container.innerHTML = "";

        matches.forEach(match => {

            const div =
                document.createElement("div");

            div.className = "match";

            div.innerHTML = `
                <strong>
                    ${match.home}
                    -
                    ${match.away}
                </strong>

                <br>

                📅 ${match.date}

                <br>

                📊 ${match.status}

                <br>

                ⚽ ${match.result ?? "-"}
            `;

            container.appendChild(div);

        });

    } catch(error) {

        console.error(
            "Fel vid laddning av matcher",
            error
        );

    }

}

// =====================================
// ALLAS TIPS
// =====================================

async function loadPredictions() {

    try {

        const response =
            await fetch("predictions.json");

        const data =
            await response.json();

        const container =
            document.getElementById(
                "predictions-container"
            );

        if (!container) return;

        container.innerHTML = "";

        data.matches.forEach(match => {

            const card =
                document.createElement("div");

            card.className =
                "match match-card";

            card.innerHTML = `
                <h3>${match.name}</h3>

                <div
                    id="match-${match.id}"
                    style="display:none;"
                ></div>
            `;

            card.addEventListener("click", () => {

                const details =
                    document.getElementById(
                        `match-${match.id}`
                    );

                if(details.style.display === "none") {

                    details.style.display = "block";

                    let html = `
                        <table
                            class="predictions-table"
                        >
                    `;

                    match.predictions.forEach(p => {

                        html += `
                            <tr>
                                <td>${p.namn}</td>
                                <td>${p.tips}</td>
                            </tr>
                        `;

                    });

                    html += "</table>";

                    details.innerHTML = html;

                } else {

                    details.style.display = "none";

                }

            });

            container.appendChild(card);

        });

    } catch(error) {

        console.error(
            "Fel vid laddning av tips",
            error
        );

    }

}

// =====================================
// NÄSTA MATCH
// =====================================

async function loadNextMatch() {

    try {

        const response =
            await fetch("nextmatch.json");

        const match =
            await response.json();

        const container =
            document.getElementById(
                "next-match-container"
            );

        if (!container) return;

        container.innerHTML = `

            <div class="match">

                <h3>
                    ${match.home}
                    -
                    ${match.away}
                </h3>

                <p>
                    📅 ${match.date}
                </p>

                <p>
                    🕘 ${match.time}
                    (${match.timezone})
                </p>

                <hr>

                <p>
                    🇨🇦 Hemmaseger:
                    ${match.majority.homeWin}
                </p>

                <p>
                    🤝 Kryss:
                    ${match.majority.draw}
                </p>

                <p>
                    🇧🇦 Bortaseger:
                    ${match.majority.awayWin}
                </p>

                <br>

                <strong>
                    Mest populära tips:
                </strong>

                <ul>

                    ${match.mostCommonPredictions
                        .map(p => `
                            <li>
                                ${p.result}
                                (${p.count} st)
                            </li>
                        `)
                        .join("")}

                </ul>

            </div>

        `;

    } catch(error) {

        console.error(
            "Fel vid laddning av nästa match",
            error
        );

    }

}

// =====================================
// STATISTIK
// =====================================

async function loadStats() {

    try {

        const response =
            await fetch("stats.json");

        const stats =
            await response.json();

        const container =
            document.getElementById(
                "stats-container"
            );

        if (!container) return;

        container.innerHTML = `

            <p>
                🥇 Ledare:
                <strong>
                    ${stats.leader.name}
                </strong>

                (${stats.leader.points}p)
            </p>

            <br>

            <p>
                ⚽ Flest fullträffar:
                <strong>
                    ${stats.mostExactResults.name}
                </strong>

                (${stats.mostExactResults.count})
            </p>

            <br>

            <p>
                🎯 Mest vågad:
                <strong>
                    ${stats.mostRisky.name}
                </strong>
            </p>

            <br>

            <p>
                👥 Deltagare:
                ${stats.participants}
            </p>

            <p>
                🏟 Matcher spelade:
                ${stats.matchesPlayed}
            </p>

            <br>

            <p>
                Senast uppdaterad:
                ${stats.lastUpdated}
            </p>

        `;

    } catch(error) {

        console.error(
            "Fel vid laddning av statistik",
            error
        );

    }

}
