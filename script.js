alert("SCRIPT STARTAR");

const API_URL =
"https://script.google.com/macros/s/AKfycbx3wjNsKzmqNAvlIjmZxFDr11BLtYqqqCCvOlNR07FUc_ExG0SmfEh7YFi1lcB0FAeg/exec";

async function fetchData() {
    const response = await fetch(
        API_URL + "?t=" + Date.now()
    );

    if (!response.ok) {
        throw new Error("API-fel");
    }

    return await response.json();
}

async function loadEverything() {

    try {

        const data = await fetchData();

        console.log(data);

        // LEADER
        const leader =
            document.getElementById(
                "leader-container"
            );

        if (leader) {

            const sheets =
                Object.keys(data)
                    .filter(
                        x => x !== "Resultat"
                    );

            leader.innerHTML = `
                <h3>🏆 VM-TIPSET</h3>
                <p>${sheets.length} deltagare laddade</p>
            `;
        }

        // MATCHER
        const matchesContainer =
            document.getElementById(
                "matches-container"
            );

        if (
            matchesContainer &&
            data.Resultat
        ) {

            matchesContainer.innerHTML = "";

            data.Resultat
    .filter(row => row[7])
    .slice(-10)
    .reverse()
    .forEach(row => {

                if (
                    !row[3] ||
                    !row[5]
                ) return;

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "match";

                div.innerHTML = `
                    <strong>
                        ${row[3]}
                        -
                        ${row[5]}
                    </strong>
                    <br>
                    Resultat:
                    ${row[7] || "-"}
                `;

                matchesContainer.appendChild(
                    div
                );

            });

        }

       // LEADERBOARD
const leaderboard =
    document.getElementById(
        "leaderboard-body"
    );

if (leaderboard) {

    leaderboard.innerHTML = "";

    const standings = [];

    Object.keys(data)
        .filter(name => name !== "Resultat")
        .forEach(player => {

            const sheet = data[player];

            let total = 0;
            let fullträffar = 0;
            let rättUtfall = 0;

            sheet.forEach(row => {

                const points =
                    parseInt(row[9]) || 0;

                total += points;

                if (points === 3)
                    fullträffar++;

                if (points === 1)
                    rättUtfall++;

            });

            standings.push({
                player,
                total,
                fullträffar,
                rättUtfall
            });

        });

standings.sort((a, b) => {

    if (b.total !== a.total) {
        return b.total - a.total;
    }

    if (b.fullträffar !== a.fullträffar) {
        return b.fullträffar - a.fullträffar;
    }

    return b.rättUtfall - a.rättUtfall;

});

    standings.forEach(
        (player, index) => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.player}</td>
                <td>${player.total}</td>
                <td>${player.fullträffar}</td>
                <td>${player.rättUtfall}</td>
            `;

            leaderboard.appendChild(row);

        }
    );

    // AKTUELL LEDARE
    if (standings.length > 0) {

        const leader =
            document.getElementById(
                "leader-container"
            );

        leader.innerHTML = `
            <h3>${standings[0].player}</h3>
            <p>${standings[0].total} poäng</p>
            <p>${standings[0].fullträffar} fullträffar</p>
        `;

    }

}
       // NÄSTA MATCH

const next =
    document.getElementById(
        "next-match-container"
    );

if (next && data.Resultat) {

    const nextMatch =
        data.Resultat.find(row => {

            const home = row[3];
            const away = row[5];
            const result = row[7];

            return (
                home &&
                away &&
                !result
            );

        });

    if (nextMatch) {

        next.innerHTML = `
            <div class="match">

                <strong>
                    ${nextMatch[3]}
                    -
                    ${nextMatch[5]}
                </strong>

                <br>

                📅 ${nextMatch[2]}

            </div>
        `;

    }

}
// =====================================
// SVERIGE-SPECIAL
// =====================================

const sweden =
    document.getElementById(
        "sweden-container"
    );

if (sweden && data.Resultat) {

    const swedenMatches =
        data.Resultat.filter(row => {

            const home = row[3];
            const away = row[5];

            return (
                home === "Sverige" ||
                away === "Sverige"
            );

        });

    let html = "";

    // Senaste Sverige-match
    const played =
        swedenMatches.filter(
            row => row[7]
        );

    if (played.length > 0) {

        const latest =
            played[played.length - 1];

        html += `
            <div class="match">
                <strong>
                    Senaste match
                </strong>
                <br>
                ${latest[3]}
                -
                ${latest[5]}
                <br>
                Resultat:
                ${latest[7]}
            </div>
        `;
    }

    // Nästa Sverige-match
    const upcoming =
        swedenMatches.find(
            row => !row[7]
        );

    if (upcoming) {

        html += `
            <div class="match">
                <strong>
                    Nästa Sverige-match
                </strong>
                <br>
                ${upcoming[3]}
                -
                ${upcoming[5]}
                <br>
                📅 ${upcoming[2]}
            </div>
        `;
    }

    // Alla Sveriges tips
    if (upcoming) {

        html += `
            <div class="match">
                <strong>
                    Allas Sverige-tips
                </strong>
                <br><br>
        `;

        const matchIndex =
            data.Resultat.findIndex(
                row =>
                    row === upcoming
            );

        Object.keys(data)
            .filter(
                x => x !== "Resultat"
            )
            .forEach(player => {

                const tip =
                    data[player][matchIndex]?.[7];

                html += `
                    <div>
                        ${player} :
                        ${tip || "-"}
                    </div>
                `;

            });

        html += `
            </div>
        `;
    }

    sweden.innerHTML = html;

}
        // PREDICTIONS
// ALLAS TIPS

const predictions =
    document.getElementById(
        "predictions-container"
    );

if (predictions && data.Resultat) {

    predictions.innerHTML = "";

    const nextMatchIndex =
        data.Resultat.findIndex(row => {

            const home = row[3];
            const away = row[5];
            const result = row[7];

            return (
                home &&
                away &&
                !result
            );

        });

    if (nextMatchIndex > -1) {

        const match =
            data.Resultat[nextMatchIndex];

        let html = `
            <div class="match">

                <strong>
                    ${match[3]}
                    -
                    ${match[5]}
                </strong>

                <br><br>
        `;

        Object.keys(data)
            .filter(
                x => x !== "Resultat"
            )
            .forEach(player => {

                const tip =
                    data[player][nextMatchIndex];

                html += `
                    <div>

                        <strong>
                            ${player}
                        </strong>

                        :
                        ${tip?.[7] || "-"}

                    </div>
                `;

            });

        html += "</div>";

        predictions.innerHTML =
            html;

    }

}

       // STATISTIK

const stats =
    document.getElementById(
        "stats-container"
    );

if (stats) {

    const standingsCount =
        Object.keys(data)
            .filter(
                x => x !== "Resultat"
            ).length;

    const matchesPlayed =
        data.Resultat.filter(
            row => row[7]
        ).length;

    stats.innerHTML = `
        <p>
            👥 Deltagare:
            ${standingsCount}
        </p>

        <p>
            ⚽ Matcher spelade:
            ${matchesPlayed}
        </p>

        <p>
            🔄 Uppdateras:
            var 30:e sekund
        </p>
    `;

}
      // STICKARE

const outliers =
    document.getElementById(
        "outliers-container"
    );

if (outliers && data.Resultat) {

    outliers.innerHTML = "";

    const nextMatchIndex =
        data.Resultat.findIndex(row => {

            const home = row[3];
            const away = row[5];
            const result = row[7];

            return (
                home &&
                away &&
                !result
            );

        });

    if (nextMatchIndex > -1) {

        const tips = {};

        Object.keys(data)
            .filter(
                x => x !== "Resultat"
            )
            .forEach(player => {

                const tip =
                    data[player][nextMatchIndex]?.[7];

                if (!tip) return;

                tips[tip] =
                    (tips[tip] || 0) + 1;

            });

        const majority =
            Object.entries(tips)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )[0]?.[0];

        let html = `
            <div class="stickare">

                <strong>
                    Majoritet:
                </strong>

                ${majority}

                <br><br>
        `;

        Object.keys(data)
            .filter(
                x => x !== "Resultat"
            )
            .forEach(player => {

                const tip =
                    data[player][nextMatchIndex]?.[7];

                if (
                    tip &&
                    tip !== majority
                ) {

                    html += `
                        <div>

                            <strong>
                                ${player}
                            </strong>

                            : ${tip}

                        </div>
                    `;

                }

            });

        html += "</div>";

        outliers.innerHTML = html;

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadEverything();

        setInterval(
            loadEverything,
            30000
        );

    }
);
