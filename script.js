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

            data.Resultat.forEach(row => {

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

        if (next) {

            next.innerHTML = `
                <div class="match">
                    Automatisk Google Sheets-version aktiv
                </div>
            `;

        }

        // PREDICTIONS
        const predictions =
            document.getElementById(
                "predictions-container"
            );

        if (predictions) {

            predictions.innerHTML = `
                Tips laddas från Google Sheets
            `;

        }

        // STATS
        const stats =
            document.getElementById(
                "stats-container"
            );

        if (stats) {

            stats.innerHTML = `
                <p>
                    API anslutet ✅
                </p>
            `;

        }

        // STICKARE
        const outliers =
            document.getElementById(
                "outliers-container"
            );

        if (outliers) {

            outliers.innerHTML = `
                Stickare kommer här
            `;

        }

    } catch (error) {

        console.error(error);

        document.body.innerHTML += `
            <div style="
                padding:20px;
                color:red;
            ">
                API-fel:
                ${error.message}
            </div>
        `;

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
