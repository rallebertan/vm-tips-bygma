// =====================================
// VM Tips Bygma 2026
// =====================================
const SHEET_ID =
"16eMjx-xSn0AHROWJUXOPyz7Z32F5oXJzxPryPyEMxzo";

const GIDS = {
  resultat: "976718944",
  jol: "503444873",
  nkk: "665250801",
  kmk: "1760403342",
  vvn: "1302942555",
  jsn: "840420629",
  voh: "1965820840",
  jbm: "1764864171",
  ehn: "2031358248",
  esm: "1887543930",
  jkn: "1838300414",
  rni: "2033019900",
  gsa: "1048491685",
  tpl: "1283857625",
  aai: "156992505",
  mnh: "1677633699",
  ptr: "958120002"
};

async function fetchSheet(gid) {

  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

  const response =
    await fetch(url);

  const text =
    await response.text();

  return text;
}
document.addEventListener("DOMContentLoaded", () => {

    loadLeaderboard();
    loadMatches();
    loadPredictions();
    loadNextMatch();
    loadStats();
    loadOutliers();

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
            document.getElementById(
                "leaderboard-body"
            );

        if (!table) return;

        table.innerHTML = "";

        players.forEach((player, index) => {

            let medal = player.placering;

            if(index === 0) medal = "🥇";
            if(index === 1) medal = "🥈";
            if(index === 2) medal = "🥉";

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${medal}</td>
                <td>${player.namn}</td>
                <td>${player.poang}</td>
                <td>${player.fulltraffar}</td>
                <td>${player.rattUtfall}</td>
            `;

            table.appendChild(row);

        });

    } catch(error) {

        console.error(
            "Leaderboard-fel",
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
            document.getElementById(
                "matches-container"
            );

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
            "Match-fel",
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

                <small>
                    Klicka för att visa tips
                </small>

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

                    let html =
                        "<table class='predictions-table'>";

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
            "Predictions-fel",
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
                </p>

                <hr>

                <p>
                    🏠 Hemmaseger:
                    ${match.majority.homeWin}
                </p>

                <p>
                    🤝 Kryss:
                    ${match.majority.draw}
                </p>

                <p>
                    ✈️ Bortaseger:
                    ${match.majority.awayWin}
                </p>

            </div>

        `;

    } catch(error) {

        console.error(
            "Next Match-fel",
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

        const leaderContainer =
            document.getElementById(
                "leader-container"
            );

        if(leaderContainer) {

            leaderContainer.innerHTML = `
                <h3>
                    🥇 ${stats.leader.name}
                </h3>

                <p>
                    ${stats.leader.points} poäng
                </p>
            `;

        }

        const container =
            document.getElementById(
                "stats-container"
            );

        if (!container) return;

        container.innerHTML = `

            <p>
                👥 Deltagare:
                ${stats.participants}
            </p>

            <br>

            <p>
                🏟 Matcher spelade:
                ${stats.matchesPlayed}
            </p>

            <br>

            <p>
                ⚽ Flest fullträffar:
                ${stats.mostExactResults.name}
                (${stats.mostExactResults.count})
            </p>

            <br>

            <p>
                🎯 Mest vågad:
                ${stats.mostRisky.name}
            </p>

            <br>

            <p>
                🕒 Uppdaterad:
                ${stats.lastUpdated}
            </p>

        `;

    } catch(error) {

        console.error(
            "Stats-fel",
            error
        );

    }

}

// =====================================
// STICKARE 2.0
// =====================================

async function loadOutliers() {

    try {

        const response =
            await fetch("predictions.json");

        const data =
            await response.json();

        const container =
            document.getElementById(
                "outliers-container"
            );

        if (!container) return;

        container.innerHTML = "";

        data.matches.forEach(match => {

            const counts = {};

            match.predictions.forEach(p => {

                counts[p.tips] =
                    (counts[p.tips] || 0) + 1;

            });

            const uniqueTips =
                Object.keys(counts)
                .filter(
                    tip => counts[tip] === 1
                );

            if(uniqueTips.length === 0)
                return;

            const div =
                document.createElement("div");

            div.className =
                "stickare";

            let html =
                `<h3>${match.name}</h3>`;

            uniqueTips.forEach(tip => {

                const player =
                    match.predictions.find(
                        p => p.tips === tip
                    );

                html += `
                    <p>
                        🎯
                        <strong>
                            ${player.namn}
                        </strong>

                        är ensam om

                        <strong>
                            ${tip}
                        </strong>
                    </p>
                `;

            });

            div.innerHTML = html;

            container.appendChild(div);

        });

    } catch(error) {

        console.error(
            "Outlier-fel",
            error
        );

    }

}
async function testGoogleSheet() {

  const csv =
    await fetchSheet(GIDS.resultat);

  console.log(csv);

}

testGoogleSheet();
