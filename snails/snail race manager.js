// ==========================================
// Witchlight Snail Race Manager
// ==========================================

const TRACK_LENGTH = 480;
const BASE_SPEED = 90;

const snails = [
    { number: 1, name: "Shellymoo", color: "Pink" },
    { number: 2, name: "Nimblefoot", color: "Blue" },
    { number: 3, name: "High Road", color: "Purple" },
    { number: 4, name: "Quickleaf", color: "Green" },
    { number: 5, name: "Flowerflash", color: "Yellow" },
    { number: 6, name: "Whizzy", color: "Orange" },
    { number: 7, name: "Breakneck", color: "Red" },
    { number: 8, name: "Queen's Majesty", color: "Black" }
];

// ==========================================
// GET PLAYERS
// ==========================================

const players = game.actors
    .filter(a => a.type === "character")
    .sort((a, b) => a.name.localeCompare(b.name));

let commonerCount = 1;

let options = `<option value="">-- Commoner NPC --</option>`;

for (let p of players) {
    options += `<option value="${p.name}">${p.name}</option>`;
}

// ==========================================
// SETUP TABLE
// ==========================================

let rows = "";

for (let snail of snails) {
    rows += `
    <tr>
      <td>${snail.number}</td>
      <td><strong>${snail.name}</strong></td>
      <td>${snail.color}</td>
      <td>
        <select id="snail-${snail.number}">
          ${options}
        </select>
      </td>
    </tr>
  `;
}

// ==========================================
// MAIN SETUP DIALOG
// ==========================================

new Dialog({
    title: " Witchlight Snail Race Setup",

    content: `
    <style>
      .snail-table {
        width: 100%;
        border-collapse: collapse;
      }

      .snail-table th,
      .snail-table td {
        border: 1px solid #555;
        padding: 6px;
        text-align: center;
      }

      .snail-table th {
        background: #222;
        color: white;
      }

      .snail-table select,
      .snail-table input {
        width: 100%;
      }
    </style>

    <p>Select a jockey for each snail.</p>

    <table class="snail-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Snail</th>
          <th>Color</th>
          <th>Rider</th>
        </tr>
      </thead>

      <tbody>
        ${rows}
      </tbody>
    </table>
  `,

    buttons: {
        start: {
            label: "Start Race",

            callback: (html) => {

                const npcNames = [
                    "Geroge",
                    "Hans",
                    "Eflina",
                    "Mims",
                    "Tumbleroot",
                    "Fenwick",
                    "Poggle",
                    "Dieter",
                    "Steve",
                    "Goku"
                ];

                let raceData = [];

                for (let snail of snails) {

                    let rider = html.find(`#snail-${snail.number}`).val();

                    if (!rider || rider === "") {
                        rider = npcNames[snail.number - 1];
                    }

                    raceData.push({
                        number: snail.number,
                        name: snail.name,
                        color: snail.color,
                        rider,
                        distance: 0
                    });
                }

                game.snailRace = {
                    round: 1,
                    snails: raceData
                };

                renderRaceTracker();
            }
        },

        cancel: {
            label: "Cancel"
        }
    },

    default: "start",
    width: 700

}).render(true);

// ==========================================
// RACE TRACKER WINDOW
// ==========================================

function renderRaceTracker() {

    const race = game.snailRace;

    let trackerRows = "";

    for (let snail of race.snails) {

        trackerRows += `
  <tr>
    <td>${snail.number}</td>

    <td>
      <strong style="
        color:${snail.color.toLowerCase()};
      ">
        ${snail.name}
      </strong>
    </td>

    <td>

      ${
            players.some(p => p.name === snail.rider)
                ? `<span style="
              color:${snail.color.toLowerCase()};
              font-weight:bold;
            ">
              ${snail.rider}
            </span>`
                : snail.rider
            }

    </td>

    <td>${snail.distance} ft</td>

    <td>

      <div style="
        display:flex;
        gap:4px;
        align-items:center;
        justify-content:center;
      ">

        <input
          type="number"
          id="check-${snail.number}"
          value="0"
          style="width:70px;"
        />

        ${
            players.some(p => p.name === snail.rider)
                ? ""
                : `
              <button
                type="button"
                class="npc-roll"
                data-snail="${snail.number}"
                style="
                  height:28px;
                  min-width:32px;
                  font-weight:bold;
                "
              >
                
              </button>
            `
            }

      </div>

    </td>
  </tr>
`;
    }

    new Dialog({

        title: ` Snail Race — Round ${race.round}`,

        content: `
      <style>
        .race-table {
          width: 100%;
          border-collapse: collapse;
        }

        .race-table th,
        .race-table td {
          border: 1px solid #555;
          padding: 6px;
          text-align: center;
        }

        .race-table th {
          background: #222;
          color: white;
        }

        .winner {
          background: rgba(0,255,0,0.2);
        }
      </style>

      <h2>Round ${race.round}</h2>

      <table class="race-table">

        <thead>
          <tr>
            <th>#</th>
            <th>Snail</th>
            <th>Rider</th>
            <th>Distance</th>
            <th>Animal Handling</th>
          </tr>
        </thead>

        <tbody>
          ${trackerRows}
        </tbody>

      </table>

      <p>
        <strong>Track Length:</strong> ${TRACK_LENGTH} ft
      </p>
    `,

        buttons: {
            
            next: {
                label: "Next Round",

                callback: (html) => {

                    let results = [];

                    for (let snail of race.snails) {

                        const check = Number(
                            html.find(`#check-${snail.number}`).val()
                        );

                        let movement = BASE_SPEED;

                        // =====================
                        // CHECK RESULTS
                        // =====================

                        if (check >= 17) {
                            movement += 20;
                        }

                        else if (check >= 12) {
                            movement += 10;
                        }

                        else if (check <= 7) {
                            movement -= 5;
                        }

                        else {
                            
                        }

                        snail.distance += movement;

                        results.push(`
              <p>
                <strong>${snail.name}</strong>
                (${snail.rider}) moved
                <strong>${movement} ft</strong>.
                Total: ${snail.distance} ft
              </p>
            `);
                    }

                    // =====================
                    // WINNERS
                    // =====================

                    const finishers = race.snails
                        .filter(s => s.distance >= TRACK_LENGTH)
                        .sort((a, b) => {

                            const aRoll = Number(html.find(`#check-${a.number}`).val()) || 0;
                            const bRoll = Number(html.find(`#check-${b.number}`).val()) || 0;

                            // primary: distance
                            if (b.distance !== a.distance) {
                                return b.distance - a.distance;
                            }

                            // secondary: current round roll (input value)
                            return bRoll - aRoll;
                        });

                    // =====================
                    // CHAT UPDATE
                    // =====================

                    let resultsTable = `
  <h2>Round ${race.round} Results</h2>

  <table style="
    width:100%;
    border-collapse:collapse;
    text-align:center;
  ">
    <tr>
      <th style="border:1px solid #555; padding:6px;">Snail</th>
      <th style="border:1px solid #555; padding:6px;">Rider</th>
      <th style="border:1px solid #555; padding:6px;">Progress</th>
    </tr>
`;

                    for (let snail of race.snails) {

                        const percent = Math.min(
                            (snail.distance / TRACK_LENGTH) * 100,
                            100
                        );

                        resultsTable += `
    <tr>
      <td style="border:1px solid #555; padding:6px;">
        <strong>${snail.name}</strong>
      </td>

      <td style="border:1px solid #555; padding:6px;">

  ${
                            players.some(p => p.name === snail.rider)
                                ? `<span style="
          color:${snail.color.toLowerCase()};
          font-weight:bold;
        ">
          ${snail.rider}
        </span>`
                                : snail.rider
  }

</td>

      <td style="border:1px solid #555; padding:6px;">

        <div style="
          width:100%;
          height:24px;
          background:#222;
          border:1px solid #777;
          position:relative;
          border-radius:12px;
          overflow:hidden;
        ">

          <div style="
            width:${percent}%;
            height:100%;
            background:${snail.color.toLowerCase()};
            transition:width 0.3s;
          "></div>

          <div style="
            position:absolute;
            width:100%;
            top:0;
            left:0;
            line-height:24px;
            font-weight:bold;
            color:white;
            text-shadow:1px 1px 2px black;
          ">
            ${snail.distance} / ${TRACK_LENGTH} ft
          </div>

        </div>

      </td>
    </tr>
  `;
                    }

                    resultsTable += `</table>`;

                    ChatMessage.create({
                        content: resultsTable
                    });

                    // =====================
                    // END RACE
                    // =====================

                    if (finishers.length > 0) {

                        let winnerText = finishers
                            .map((w, i) => {

                                const finalRoll = Number(
                                    html.find(`#check-${w.number}`).val()
                                ) || 0;

                                return `
                <li>
                    <strong>#${i + 1} ${w.name}</strong>
                    (${w.rider}) —
                    ${w.distance} ft —
                    Roll: ${finalRoll}
                </li>
            `;
                            })
                            .join("");

                        ChatMessage.create({
                            content: `
            <h1>Race Finished!</h1>

            <p>Final standings:</p>

            <ol>
                ${winnerText}
            </ol>
        `
                        });

                        ui.notifications.info("The race has ended!");

                        return;
                    }

                    // =====================
                    // NEXT ROUND
                    // =====================

                    race.round++;

                    renderRaceTracker();
                }
            },

            close: {
                label: "Close"
            }
        },

        default: "next",

        width: 850,

        render: (html) => {

            html.find(".npc-roll").click(async event => {

                const snailNumber = event.currentTarget.dataset.snail;

                const roll = await (new Roll("1d20")).evaluate();

                const chatData = await roll.toMessage({
                    flavor: `NPC Animal Handling Check`,
                    create: true
                });

                // chatData is the created ChatMessage
                if (chatData ?.id) {
                    const msg = game.messages.get(chatData.id);
                    if (msg) await msg.delete();
                }

                html.find(`#check-${snailNumber}`).val(roll.total);

            });

        }

    }).render(true);
}