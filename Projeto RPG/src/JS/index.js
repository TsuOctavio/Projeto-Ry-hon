// Config - Pages
const list = document.querySelector('.list ul');
let pageCount = 1;

// Function to show the selected page and update the title
function showPageById(targetId, titleText) {
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
  });

  const targetPage = document.querySelector(`.page[data-page="${targetId}"]`);
  if (targetPage) {
    if (["dice", "sheet", "Guild", "Big_NPCs"].includes(targetId)) {
      targetPage.style.display = 'flex';
    } else {
      targetPage.style.display = 'block';
    }
  }

  const titlePage = document.getElementById("title_page");
  if (titlePage) titlePage.textContent = titleText;

  if (targetId === 'Big_NPCs') {
    loadClanData("Oda");
  }
}

// Function to setup click and right-click behavior on list items
function setupListButton(liElement, name, targetId) {
  liElement.addEventListener("click", () => {
    showPageById(targetId, name);
  });

  // Right click opens the context menu
  liElement.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    currentListItem = liElement;
    listContextMenu.style.left = `${e.pageX}px`;
    listContextMenu.style.top = `${e.pageY}px`;
    listContextMenu.style.display = "block";
  });
}

function createListButton(name, targetId) {
  const li = document.createElement("li");
  li.setAttribute("data-target", targetId);

  const nameSpan = document.createElement("span");
  nameSpan.textContent = name;
  li.appendChild(nameSpan);

  setupListButton(li, name, targetId);
  return li;
}

// Initialize fixed buttons (Dice, War, World)
document.querySelectorAll('.list li[data-target]').forEach(item => {
  const target = item.getAttribute('data-target');
  const name = item.textContent.trim();

  const newLi = createListButton(name, target);
  item.replaceWith(newLi);
});

//More_sheet
// More_Sheet Configuration
let sheetCount = 1;

document.getElementById("more_sheet").addEventListener("click", () => {
  const name = prompt("Enter the name of the new character sheet:");
  if (!name) return;

  const targetId = `sheet${sheetCount++}`;

  // 1 - Clone the sheet page
  const sheetPage = document.querySelector('.page[data-page="sheet"]');
  const newPage = sheetPage.cloneNode(true);
  newPage.setAttribute('data-page', targetId);
  document.getElementById("tab_1").appendChild(newPage);

  // 2 - Setup more_skill button for the new page
  const skillList = newPage.querySelector('.skills');
  const moreSkillBtn = newPage.querySelector('.more_skill');
  moreSkillBtn.addEventListener('click', () => {
    const li = document.createElement('li');
    li.contentEditable = "true";
    const span = document.createElement('span');
    span.classList.add('iten_name');
    span.contentEditable = "true";
    li.appendChild(span);
    skillList.appendChild(li);
  });

  // 3 - Setup more_iten button for the new page
  const itemList = newPage.querySelector('.iten_list');
  const moreItenBtn = newPage.querySelector('.more_iten');
  moreItenBtn.addEventListener('click', () => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = "number";
    input.classList.add('N2');
    input.value = 1;
    input.min = 0;
    const span = document.createElement('span');
    span.classList.add('iten_name');
    span.contentEditable = "true";
    span.textContent = "New Item";
    li.appendChild(input);
    li.appendChild(span);
    itemList.appendChild(li);
  });

  // 4 - Create new li in Tfoot to access this new sheet
  const newLi = document.createElement("li");
  newLi.classList.add("Character_sheet");
  newLi.textContent = name;
  newLi.setAttribute('data-target', targetId);

  // Open the new sheet on click
  newLi.addEventListener("click", () => {
    showPageById(targetId, name);
  });

  // 5 - Add context menu (Edit and Delete) for the new Tfoot li
  newLi.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const menu = document.createElement("ul");
    menu.style.position = "absolute";
    menu.style.background = "#222";
    menu.style.color = "#fff";
    menu.style.listStyle = "none";
    menu.style.padding = "5px";
    menu.style.borderRadius = "5px";
    menu.style.zIndex = "1000";

    const editOption = document.createElement("li");
    editOption.textContent = "Edit";
    editOption.style.cursor = "pointer";
    editOption.addEventListener("click", () => {
      const newName = prompt("Rename sheet:", newLi.textContent);
      if (newName) newLi.textContent = newName;
      document.body.removeChild(menu);
    });

    const deleteOption = document.createElement("li");
    deleteOption.textContent = "Delete";
    deleteOption.style.cursor = "pointer";
    deleteOption.addEventListener("click", () => {
      newPage.remove();
      newLi.remove();
      document.body.removeChild(menu);
    });

    menu.appendChild(editOption);
    menu.appendChild(deleteOption);

    const menuHeight = 120;
    const windowHeight = window.innerHeight;

    if (e.clientY + menuHeight > windowHeight) {
      menu.style.left = `${e.pageX}px`;
      menu.style.top = `${e.pageY - menuHeight}px`;
    } else {
      menu.style.left = `${e.pageX}px`;
      menu.style.top = `${e.pageY}px`;
    }

    document.body.appendChild(menu);

    document.addEventListener("click", () => {
      if (document.body.contains(menu)) document.body.removeChild(menu);
    }, { once: true });
  });

  document.getElementById("Tfoot").appendChild(newLi);
});


//Tab 2 table
function updateCharacterTable() {
  const tableBody = document.getElementById("character-table-body");
  tableBody.innerHTML = "";

  document.querySelectorAll("#Tfoot li.Character_sheet").forEach(li => {
    const sheetName = li.textContent.trim();
    const targetId = li.getAttribute("data-target");

    if (!targetId) return;

    const sheetPage = document.querySelector(`.page[data-page="${targetId}"]`);
    if (!sheetPage) return;

    const stats = ["str", "dex", "con", "per", "int", "wil", "cha", "fai", "mag", "aur", "Karma", "Gold"];
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = sheetName;
    nameCell.style.maxWidth = "150px";
    nameCell.style.wordWrap = "break-word";
    nameCell.style.whiteSpace = "normal";
    row.appendChild(nameCell);

    stats.forEach(stat => {
      const input = sheetPage.querySelector(`input.${stat}`);
      const td = document.createElement("td");
      td.textContent = input ? input.value : "-";
      row.appendChild(td);
    });

    tableBody.appendChild(row);
  });
}

document.getElementById("updateTableButton").addEventListener("click", updateCharacterTable);

//Botton of table 
let currentSortColumn = null;
let sortDirection = 1;

document.querySelectorAll("#character-table th").forEach((th, index) => {
  th.addEventListener("click", () => {
    sortTableByColumn(index);
  });
});

function sortTableByColumn(columnIndex) {
  const tableBody = document.getElementById("character-table-body");
  const rowsArray = Array.from(tableBody.querySelectorAll("tr"));

  rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.children[columnIndex].textContent.trim();
    const cellB = rowB.children[columnIndex].textContent.trim();

    const valueA = parseInt(cellA);
    const valueB = parseInt(cellB);

    if (columnIndex === 0 || isNaN(valueA) || isNaN(valueB)) {
      return cellA.localeCompare(cellB) * sortDirection;
    } else {
      return (valueA - valueB) * sortDirection;
    }
  });

  tableBody.innerHTML = "";
  rowsArray.forEach(row => tableBody.appendChild(row));

  if (currentSortColumn === columnIndex) {
    sortDirection *= -1;
  } else {
    sortDirection = 1;
    currentSortColumn = columnIndex;
  }
}


//Map
const mapContainer = document.getElementById("mapContainer");

let scale = 1;
let translate = { x: 0, y: 0 };
let dragging = false;
let dragStart = { x: 0, y: 0 };
let currentClan = null;
let infoMode = false;
let tooltip = null;

fetch("src/Images/Sketch/Maps-not-colered.svg")
  .then(res => res.text())
  .then(svgText => {
    mapContainer.innerHTML = svgText;
    const svgRoot = mapContainer.querySelector("svg");

    svgRoot.style.transformOrigin = "0 0";
    svgRoot.style.transformBox = "fill-box";

    // Zoom
    mapContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY < 0 ? 1.1 : 0.9;
      scale *= zoom;
      updateTransform();
    });

    // Pan
    mapContainer.addEventListener('mousedown', (e) => {
      dragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      dragStart = { x: e.clientX, y: e.clientY };
      translate.x += dx;
      translate.y += dy;
      updateTransform();
    });

    window.addEventListener('mouseup', () => dragging = false);

    function updateTransform() {
      const containerWidth = mapContainer.clientWidth;
      const containerHeight = mapContainer.clientHeight;

      const svgWidth = svgRoot.getBBox().width * scale;
      const svgHeight = svgRoot.getBBox().height * scale;

      const maxX = 0;
      const minX = containerWidth - svgWidth;
      const maxY = 0;
      const minY = containerHeight - svgHeight;

      translate.x = Math.min(maxX, Math.max(minX, translate.x));
      translate.y = Math.min(maxY, Math.max(minY, translate.y));

      svgRoot.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
    }

    // TOOLTIPS and paint
    const stateData = {
      "Mutsu_1": { clan: "Date" },
      "Mutsu_2": { clan: "Date" },
      "Dewa_1": { clan: "Mogami" },
      "Dewa_2": { clan: "Mogami" },
      "Mutsu_3": { clan: "Hatakeyama" },
      "Noto": { clan: "Hatakeyama" },
      "Kii": { clan: "Hatakeyama" },
      "Kawachi": { clan: "Hatakeyama" },
      "Mutsu_4": { clan: "Ashina" },
      "Sado": { clan: "Uesugi" },
      "Echigo": { clan: "Uesugi" },
      "Kozuke": { clan: "Uesugi" },
      "Shimosa": { clan: "Satomi" },
      "Kazusa": { clan: "Satomi" },
      "Musashi": { clan: "Hojo" },
      "Sagami": { clan: "Hojo" },
      "Izu": { clan: "Hojo" },
      "Shinano_1": { clan: "Takeda" },
      "Shinano_2": { clan: "Takeda" },
      "Kai": { clan: "Takeda" },
      "Suruga": { clan: "Imagawa" },
      "Hotomi": { clan: "Imagawa" },
      "Mikawa": { clan: "Tokugawa" },
      "Owari": { clan: "Oda" },
      "Mino": { clan: "Saito" },
      "Hida": { clan: "Anegakoji" },
      "Etchu": { clan: "Ikko-Ikki" },
      "Kaga": { clan: "Asakura" },
      "Echizen": { clan: "Asakura" },
      "Wakaza": { clan: "Azai" },
      "Omi": { clan: "Rokkaku" },
      "Iga": { clan: "Iga" },
      "Ise": { clan: "Kitabatake" },
      "Yamato": { clan: "Matsunaga" },
      "Yamashiro": { clan: "Ashikaga" },
      "Tanba": { clan: "Hatano" },
      "Settsu": { clan: "Miyoshi" },
      "Awaji": { clan: "Miyoshi" },
      "Awa": { clan: "Miyoshi" },
      "Harima": { clan: "Bessho" },
      "Tango": { clan: "Hosokawa" },
      "Sanuki": { clan: "Hosokawa" },
      "Tajima": { clan: "Yamana" },
      "Inaba": { clan: "Yamana" },
      "Mimasaka": { clan: "Urakami" },
      "Bizen": { clan: "Urakami" },
      "Bitchu": { clan: "Ukita" },
      "Bingo": { clan: "Kikkawa" },
      "Hoki": { clan: "Amako" },
      "Izumo": { clan: "Amako" },
      "Iwami": { clan: "Amako" },
      "Aki": { clan: "Mori" },
      "Suo": { clan: "Mori" },
      "Choshu": { clan: "Mori" },
      "Tosa": { clan: "Chokabe" },
      "Iyo": { clan: "Kono" },
      "Bungo": { clan: "Otomo" },
      "Buzen": { clan: "Otomo" },
      "Chikuzen": { clan: "Ryuzoji" },
      "Hizen": { clan: "Ryuzoji" },
      "Higo": { clan: "Sagara" },
      "Satsuma": { clan: "Shimazu" },
      "Hyuga": { clan: "Ito" },
      "Osumi": { clan: "Ito" }
    };

    svgRoot.querySelectorAll("[id]").forEach(el => {
      if (el.id === "g511") return;

      el.addEventListener("mouseenter", (e) => {
        if (!infoMode) return;
        const id = el.id;
        const clan = stateData[id]?.clan || "Independente";

        const otherStates = Object.entries(stateData)
          .filter(([k, v]) => v.clan === clan && k !== id)
          .map(([k]) => k);

        tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerHTML = `<strong>${id}</strong><br>${clan}` +
          (otherStates.length ? `<br><small>+${otherStates.join(", ")}</small>` : "");
        document.body.appendChild(tooltip);
      });

      el.addEventListener("mousemove", (e) => {
        if (tooltip) {
          tooltip.style.left = (e.pageX + 10) + "px";
          tooltip.style.top = (e.pageY - tooltip.offsetHeight - 10) + "px";
        }
      });

      el.addEventListener("mouseleave", () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });

      el.addEventListener("click", () => {
        if (!currentClan) return;
        el.style.fill = currentClan.color;
        stateData[el.id] = { clan: currentClan.name };
      });
    });

    // Clan button
    document.querySelectorAll(".clan-button").forEach(button => {
      button.addEventListener("click", () => {
        document.body.style.cursor = "crosshair";
        currentClan = {
          name: button.dataset.clan,
          color: button.style.backgroundColor
        };
      });
    });

    //INFO mode
    const infoButton = document.getElementById("infoMode");
    if (infoButton) {
      infoButton.addEventListener("click", () => {
        infoMode = !infoMode;
        document.body.style.cursor = infoMode ? "help" : "default";
      });
    }

    document.addEventListener("click", (e) => {
      if (!mapContainer.contains(e.target) && !document.getElementById("legend").contains(e.target)) {
        document.body.style.cursor = "default";
        currentClan = null;
        infoMode = false;
      }
    });

  });


//Guild_Description - Party
const rankDescriptions = {
  F: "Started — Newbie, handles only basic tasks.",
  E: "Aspirant — Has started light fighting and logistics.",
  D: "Mercenary — Authorized to patrol and eliminate bandits.",
  C: "Frontier Warrior — Participates in regional skirmishes and tactical missions.",
  B: "Recognized Blade — Earns their own orders, active participant in wars.",
  A: "Weight Name — Influences battles and political decisions.",
  S: "Living Legend — Feared and revered by all; their name echoes in history.",
};

document.getElementById("Rank_F_to_S").addEventListener("change", () => {
  const selectedRank = document.getElementById("Rank_F_to_S").value;
  const description = rankDescriptions[selectedRank] || "No description available.";
  document.getElementById("Party_description_2").textContent = description;
});



//Quests - Guild
// Rank quest
const questsByRank = {
  F: [
    { desc: "Help harvest rice in a local village", reward: 66, points: 3 },
    { desc: "Protect an old monk to a nearby temple", reward: 54, points: 2 },
    { desc: "Hunt giant rats in a grain warehouse", reward: 55, points: 5 },
    { desc: "Deliver mail to three villages", reward: 63, points: 3 },
    { desc: "Help rebuild a destroyed bridge", reward: 59, points: 5 },
    { desc: "Clean up an abandoned temple", reward: 57, points: 3 },
    { desc: "Investigate missing chickens in a village", reward: 68, points: 2 },
    { desc: "Accompany children on their way to temple school", reward: 64, points: 5 },
    { desc: "Help transport local supplies", reward: 63, points: 3 },
    { desc: "Assist local patrol officers for a night", reward: 70, points: 3 },
  ],
  E: [
    { desc: "Hunt wolves attacking livestock", reward: 102, points: 5 },
    { desc: "Patrol a road between villages", reward: 95, points: 6 },
    { desc: "Bring urgent medicine to an isolated village", reward: 93, points: 6 },
    { desc: "Transport religious artifacts safely", reward: 101, points: 7 },
    { desc: "Guard a warehouse at night", reward: 85, points: 6 },
    { desc: "Investigate strange footprints in the forest", reward: 107, points: 5 },
    { desc: "Accompany a merchant on a dangerous road", reward: 88, points: 6 },
    { desc: "Search for medicinal herbs in a yokai area", reward: 104, points: 6 },
    { desc: "Train local militia for basic defense", reward: 94, points: 4 },
    { desc: "Scare away bandits from a farm", reward: 95, points: 4 },
  ],
  D: [
    { desc: "Eliminate a band of highway robbers", reward: 130, points: 7 },
    { desc: "Protect a merchant caravan", reward: 120, points: 7 },
    { desc: "Investigate the disappearance of peasants", reward: 139, points: 6 },
    { desc: "Explore a cave with mysterious sounds", reward: 136, points: 7 },
    { desc: "Help a temple attacked by minor yokai", reward: 141, points: 7 },
    { desc: "Rescue a kidnapped child", reward: 135, points: 8 },
    { desc: "Dismantle a trap on a military road", reward: 120, points: 7 },
    { desc: "Escort a city magistrate", reward: 122, points: 6 },
    { desc: "Recover a noble family heirloom", reward: 134, points: 6 },
    { desc: "Destroy a small rebel camp", reward: 137, points: 6 },
    { desc: "Track a yokai that escaped from a ritual prison", reward: 123, points: 7 },
    { desc: "Survey suspicious movement in a border town", reward: 127, points: 8 },
    { desc: "Defend a village during a local festival", reward: 125, points: 6 },
    { desc: "Help hunters on a mission against a supernatural beast", reward: 133, points: 8 },
    { desc: "Reorganize supplies lost in an attack", reward: 129, points: 7 },
    { desc: "Capture a bandit leader alive for questioning", reward: 140, points: 8 },
    { desc: "Observe a suspicious ceremony in an isolated temple", reward: 121, points: 6 },
    { desc: "Clear ancient ruins of traps and spirits", reward: 138, points: 7 },
    { desc: "Escort a famous artist to another city", reward: 132, points: 6 },
    { desc: "Keep order during the distribution of war supplies", reward: 126, points: 7 },
  ],
  C: [
    { desc: "Defend a village wall in conflict", reward: 189, points: 10 },
    { desc: "Infiltrate a rival group and obtain information", reward: 185, points: 9 },
    { desc: "Fight a creeping yokai that haunts a mountain", reward: 176, points: 8 },
    { desc: "Escort a military shipment to the border", reward: 188, points: 10 },
    { desc: "Sabotage a bridge in an enemy-controlled region", reward: 192, points: 11 },
    { desc: "Protect a festival in an important city", reward: 180, points: 9 },
    { desc: "Capture a spy from a rival clan", reward: 186, points: 8 },
    { desc: "Accompany and protect a diplomat", reward: 181, points: 9 },
    { desc: "Hunt a large spirit beast", reward: 191, points: 10 },
    { desc: "Evacuate civilians during an armed conflict", reward: 179, points: 8 },
    { desc: "Map an alternative route for imperial troops", reward: 183, points: 9 },
    { desc: "Interrupt a summoning ritual in a dark forest", reward: 187, points: 10 },
    { desc: "Recover documents stolen by dissidents", reward: 178, points: 9 },
    { desc: "Defend a temple under attack by fanatics", reward: 182, points: 8 },
    { desc: "Investigate a mine where miners have gone mad", reward: 175, points: 9 },
    { desc: "Establish a new observation post in a disputed region", reward: 184, points: 10 },
    { desc: "Protect a convoy of sacred supplies", reward: 186, points: 9 },
    { desc: "Defeat a group of monks corrupted by yokai", reward: 193, points: 11 },
    { desc: "Intercept a diplomatic message and exchange it without being noticed", reward: 177, points: 10 },
    { desc: "Recover an artifact sunk in a spiritual lake", reward: 190, points: 9 },
  ],
  B: [
    { desc: "Assassinate enemy general during battle", reward: 258, points: 14 },
    { desc: "Protect gold shipment through hostile territory", reward: 268, points: 13 },
    { desc: "Negotiate with yokai to liberate territory", reward: 249, points: 12 },
    { desc: "Infiltrate fortress and steal war maps", reward: 262, points: 14 },
    { desc: "Destroy unholy altar in cursed forest", reward: 265, points: 13 },
    { desc: "Defend village from coordinated bandit attack", reward: 255, points: 12 },
    { desc: "Investigate corruption in allied city", reward: 257, points: 13 },
    { desc: "Eliminate monster enslaving forest spirits", reward: 264, points: 14 },
    { desc: "Escort disguised nobleman to neutral region", reward: 266, points: 13 },
    { desc: "Organize ambush in strategic valley", reward: 250, points: 12 },
    { desc: "Eliminate conspiring emissary of rival clan", reward: 259, points: 13 },
    { desc: "Escort sacred convoy from distant lands", reward: 248, points: 12 },
    { desc: "Contain possession outbreaks in rural city", reward: 260, points: 14 },
    { desc: "Install spies in enemy council", reward: 267, points: 13 },
    { desc: "Disrupt enemy supply line", reward: 256, points: 12 },
    { desc: "Win duel against rival city champion", reward: 263, points: 14 },
    { desc: "Organize evacuation of isolated monastery", reward: 251, points: 12 },
    { desc: "Deal with yokai that take the form of familiar people", reward: 269, points: 13 },
    { desc: "Protect advisor carrying secret treaties", reward: 270, points: 13 },
    { desc: "Steal enemy war flag to break morale", reward: 253, points: 12 },
  ],
  A: [
    { desc: "Seal an accidentally released ancient yokai", reward: 420, points: 18 },
    { desc: "Command the defense of a besieged city", reward: 409, points: 17 },
    { desc: "Assume a false identity to infiltrate the enemy council", reward: 415, points: 18 },
    { desc: "Protect a sacred temple against an enemy army", reward: 425, points: 17 },
    { desc: "Prevent the assassination of a regional governor", reward: 402, points: 16 },
    { desc: "Eliminate a traitor who infiltrated the allied army", reward: 417, points: 18 },
    { desc: "Explore the cursed ruins of a lost castle", reward: 432, points: 17 },
    { desc: "Suppress a revolt in a city with speech and force", reward: 418, points: 16 },
    { desc: "Recover a legendary weapon from the hands of an oni", reward: 427, points: 18 },
    { desc: "Mediate a treaty between two clans on the verge of war", reward: 421, points: 16 },
    { desc: "Investigate disappearances in a forest where time has come to", reward: 416, points: 17 },
    { desc: "Undo a curse that affects a daimyō's lineage", reward: 430, points: 18 },
    { desc: "Protect the imperial library during a conflict", reward: 405, points: 17 },
    { desc: "Sabotage a secret alliance ceremony between rebel clans", reward: 408, points: 16 },
    { desc: "Ensure the transportation of a religious artifact between rival regions", reward: 411, points: 17 },
    { desc: "Create disinformation to demoralize a rival clan", reward: 426, points: 17 },
    { desc: "Stop a group of legendary assassins who crossed the border", reward: 429, points: 18 },
    { desc: "Discover the origin of earthquakes caused by underground yokai", reward: 419, points: 17 },
    { desc: "Forge an alliance between humans and the guardian spirit of a region", reward: 423, points: 16 },
    { desc: "Defend the spiritual successor of the south on a prophetic journey", reward: 413, points: 18 },
  ],
  S: [
    { desc: "Defeat a celestial dragon that corrupts the sky", reward: 650, points: 25 },
    { desc: "Rebuild a shrine using stolen spiritual power", reward: 620, points: 24 },
    { desc: "Face an invincible general and win in open field", reward: 640, points: 26 },
    { desc: "Confront a fallen kami who commands an army of the dead", reward: 660, points: 27 },
    { desc: "Negotiate peace between humans and the yokai kingdom", reward: 600, points: 23 },
    { desc: "Eliminate a group of legendary assassins who threaten the Guild", reward: 610, points: 22 },
    { desc: "Recover an artifact capable of destroying entire provinces", reward: 670, points: 28 },
    { desc: "Protect the imperial successor during a secret ceremony", reward: 630, points: 25 },
    { desc: "Liberate a city subjugated by an ancient evil spirit", reward: 645, points: 26 },
    { desc: "Slay a minor god freed by a ritual error", reward: "700 + divine blessing", points: 30 },
  ]
};

const specialRequests = {
  B: [
    { desc: "(Village Chief) Find Kagemaru's missing son", reward: "750 + Village Alliance", points: 16 },
    { desc: "(Daimyō of Kai Province) Recover Takeda clan's ancient armor", reward: "900 + Legendary Item", points: 18 },
    { desc: "(Miners of Mountain) Investigate voices whispering in the caves that led to the deaths of three excavators.", reward: "880 + spiritual crystals", points: 17 },
    { desc: "(Elderly Swordmaster) Challenge and defeat 7 swordsmen of lost styles in honor of an ancient spiritual treatise.", reward: "950 + secret technique", points: 19 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
  ],
  A: [
    { desc: "(Street Artist with Sealed Pact) Slay an Oni disguised as a human with masks", reward: "1100 + Cursed Mask", points: 21 },
    { desc: "(Head of Temple) Investigate a village where an invisible Oni manipulates emotions, driving the villagers mad.", reward: "1200 + spiritual seal", points: 22 },
    { desc: "(Neighboring Daimyō of Echigo) Save important hostages before the besieged castle is taken by rebel forces.", reward: "1300 + influence letter", points: 20 },
    { desc: "(Exiled Shugenja of Sado) Steal scrolls from the temple where you were betrayed, without harming the monks, and destroy the final seal.", reward: "1250 + forbidden spiritual art", points: 23 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
  ],
  S: [
    { desc: "(Spiritual Guardian of Lake) Reunite 3 artifacts to restore Lake Aoi", reward: "2000 + Eternal Blessing", points: 30 },
    { desc: "(Messenger of the “Dark Throne”) Protect the true imperial heir as he travels between monasteries in disguise.", reward: "1800 + political immunity", points: 28 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
    { desc: "None", reward: "0", points: 0 },
  ]
};

const rankOrder = ["F", "E", "D", "C", "B", "A", "S"];

document.getElementById("Quest_search").addEventListener("click", () => {
  const selectedRank = document.getElementById("Rank_F_to_S").value;
  const rankIndex = rankOrder.indexOf(selectedRank);

  let availableQuests = [];

  for (let i = 0; i <= rankIndex; i++) {
    const r = rankOrder[i];
    if (questsByRank[r]) {
      questsByRank[r].forEach(q => availableQuests.push({ ...q, rank: r }));
    }
  }

  const sameRankQuests = questsByRank[selectedRank] || [];
  const selected = [];

  if (sameRankQuests.length > 0) {
    const q = sameRankQuests[Math.floor(Math.random() * sameRankQuests.length)];
    selected[2] = { ...q, rank: selectedRank };
  }

  const usedDescriptions = new Set([selected[2]?.desc]);
  while (selected.filter(Boolean).length < 3 && availableQuests.length > 0) {
    const idx = Math.floor(Math.random() * availableQuests.length);
    const q = availableQuests.splice(idx, 1)[0];
    if (usedDescriptions.has(q.desc)) continue;

    const emptySlot = selected.findIndex(e => !e);
    selected[emptySlot] = q;
    usedDescriptions.add(q.desc);
  }

  let specialQuest = null;
  if (["B", "A", "S"].includes(selectedRank) && specialRequests[selectedRank]) {
    const specials = specialRequests[selectedRank];
    const sp = specials[Math.floor(Math.random() * specials.length)];
    specialQuest = {
      ...sp,
      rank: `Special Request (${selectedRank})`
    };
  }

  for (let i = 0; i < 3; i++) {
    const q = selected[i];
    const qEl = document.querySelector(`[data-quests="${i + 1}"]`);
    if (q && qEl) {
      qEl.innerHTML = `<strong>Rank ${q.rank}</strong><br>${q.desc}<br><em>Reward:</em> ${q.reward} coins<br><em>Mercenary Points:</em> ${q.points}`;
    } else if (qEl) {
      qEl.innerHTML = "";
    }
  }

  const specialEl = document.querySelector('[data-quests="4"]');
  if (specialEl) {
    if (specialQuest) {
      specialEl.innerHTML = `<strong>${specialQuest.rank}</strong><br>${specialQuest.desc}<br><em>Reward:</em> ${specialQuest.reward} coins<br><em>Mercenary Points:</em> ${specialQuest.points}`;
    } else {
      specialEl.innerHTML = "";
    }
  }
});


//Territories
let food = parseInt(document.getElementById("Food").value) || 0;
let army = parseInt(document.getElementById("Army").value) || 0;
let happiness = parseInt(document.getElementById("Happiness").value) || 0;
let population = parseInt(document.getElementById("Population").value) || 0;
let agriculture = parseInt(document.getElementById("Agriculture").value) || 0;
let money = parseInt(document.getElementById("Money").value) || 0;
let infrastructure = parseInt(document.getElementById("Infrastructure").value) || 0;
let business = parseInt(document.getElementById("Business").value) || 0;

// Control variables
let unemployed = 0;
let foodChange = 0;
let happinessChange = 0;
let moneyChange = 0;
let populationChange = 0;


foodChange -= population;
foodChange += agriculture * 3;

if (food + foodChange > 0) {
  happinessChange += 2;
} else {
  happinessChange -= 5;
}


moneyChange -= army;
happinessChange += Math.floor(army / 10);


if (happiness >= 40) {
  populationChange += 10;
}
if (happiness < 20) {
  happinessChange -= 10;
}
if (happiness >= 70) {
  foodChange += 5;
  moneyChange += 5;
}


moneyChange += population * 2;


moneyChange -= infrastructure;
if (infrastructure >= population + 10) {
  happinessChange += 2;
}
if (infrastructure < population) {
  happinessChange -= 7;
}


moneyChange += business * 3;

//Random events
function removeWorkers(count) {
  for (let i = 0; i < count; i++) {
    const options = [];
    if (agriculture > 0) options.push("agriculture");
    if (business > 0) options.push("business");
    if (army > 0) options.push("army");

    if (options.length === 0) break;

    const chosen = options[Math.floor(Math.random() * options.length)];
    if (chosen === "agriculture") agriculture--;
    else if (chosen === "business") business--;
    else if (chosen === "army") army--;
  }
}

const randomEvents = {
  visit: [
    { title: "Traveling Artist", description: "A famous artist brings joy.<br><br>description:<br>happiness +10", effect: () => happiness += 10 },
    { title: "Honest Merchant", description: "A merchant brings great trade.<br><br>description:<br>money +200", effect: () => money += 200 },
    { title: "Dishonest Merchant", description: "A merchant scammed the people.<br><br>description:<br>happiness -5<br>money -100", effect: () => { money -= 100; happiness -= 5; } },
    { title: "Refugees Arrive", description: "Refugees ask for shelter.<br><br>description:<br>population +30<br>food -30", effect: () => { population += 30; food -= 30; } },
    { title: "Wandering Monk", description: "A peaceful monk shares wisdom with your citizens.<br><br>description:<br>happiness +5", effect: () => { happiness += 5; } },
    { title: "Noble from Distant Land", description: "A foreign noble visits with expensive gifts.<br><br>description:<br>happiness +5<br>money +150", effect: () => { money += 150; happiness += 5; } },
    { title: "Suspicious Wanderer", description: "A lone traveler refuses to give his name. Tensions rise.<br><br>description:<br>happiness -5", effect: () => { happiness -= 5; } },
    { title: "Famous Storyteller", description: "A bard captivates the people with tales of old heroes.<br><br>description:<br>happiness +8", effect: () => { happiness += 8; } },
    { title: "Wounded Samurai", description: "A warrior with deep wounds asks for sanctuary.<br><br>description:<br>army +10<br>food -20", effect: () => { army += 10; food -= 20; } },
    {
      title: "The Royal Inspector", description: "An agent of the Emperor inspects your town.<br><br>description:<br>if happiness > 60 → money +300<br>else → happiness -5", effect: () => {
        if (happiness > 60) {
          money += 300;
        } else {
          happiness -= 5;
        }
      }
    },
    { title: "Medicine Seller", description: "An herbalist offers rare potions for a small fee.<br><br>description:<br>happiness +3<br>money -50", effect: () => { happiness += 3; money -= 50; } },
    { title: "Troubadour Couple", description: "A pair of musicians attracts large crowds nightly.<br><br>description:<br>happiness +10<br>food -30", effect: () => { happiness += 10; food -= 30; } },
    { title: "Foreign Ambassador", description: "An envoy from another nation seeks diplomatic contact.<br><br>description:<br>happiness +5", effect: () => { happiness += 5; } },
    { title: "Outlaw in Disguise", description: "A criminal poses as a traveling merchant.<br><br>description:<br>happiness -5<br>money -100", effect: () => { happiness -= 5; money -= 100; } },
    { title: "Wandering Blacksmith", description: "A master craftsman offers to forge weapons for your soldiers.<br><br>description:<br>army +10<br>money -100", effect: () => { money -= 100; army += 10; } },
    { title: "Former Servant Returns", description: "An old servant who fled during a rebellion comes back in shame.<br><br>description:<br>happiness +2", effect: () => { happiness += 2; } },
    { title: "Diviner Passes Through", description: "A mysterious oracle speaks of omens and future trials.<br><br>description:<br>happiness +5", effect: () => { happiness += 5; } },
    { title: "Drunken Poet", description: "A poetic drunk entertains the crowds but causes some trouble.<br><br>description:<br>happiness +10<br>food -10", effect: () => { happiness += 10; food -= 10; } },
    { title: "Missionary from a Foreign Religion", description: "A missionary preaches a new faith to the people.<br><br>description:<br>happiness +5", effect: () => { happiness += 5; } },
    { title: "Wandering Farmer", description: "An experienced farmer offers to teach new crop rotation methods.<br><br>description:<br>agriculture +2<br>food +50", effect: () => { agriculture += 2; food += 50; } }
  ],
  attack: [
    { title: "Bandit Raid", description: "Bandits raided the outskirts of your territory.<br><br>description:<br>money -200<br>happiness -10<br>population -5<br>business -5", effect: () => { money -= 200; happiness -= 10; population -= 5; business = Math.max(0, business - 5); removeWorkers(5); } },
    { title: "Monster Rampage", description: "A beast attacked a village at night.<br><br>description:<br>food -100<br>population -15", effect: () => { food -= 100; population -= 15; removeWorkers(15); } },
    { title: "Infestation of Locusts", description: "Locusts devoured crops across multiple farms.<br><br>description:<br>food -200", effect: () => { food -= 200; } },
    { title: "Rats in the Granary", description: "Rats destroyed a portion of your stored food.<br><br>description:<br>food -80", effect: () => { food -= 80; } },
    { title: "Enemy Scouts Spotted", description: "Foreign scouts were seen near your borders.<br><br>description:<br>happiness -15", effect: () => { happiness -= 15; } },
    { title: "Small Clan Skirmish", description: "A minor clan attacked a frontier post.<br><br>description:<br>army -5<br>happiness -5<br>population -5", effect: () => { army = Math.max(0, army - 5); happiness -= 5; population -= 5; removeWorkers(5); } },
    { title: "Bandit Hideout Discovered", description: "You found a bandit camp but they escaped after setting fire.<br><br>description:<br>food -50<br>army -2<br>population -2<br>agriculture -2", effect: () => { food -= 50; army = Math.max(0, army - 2); population -= 2; agriculture = Math.max(0, agriculture - 2); removeWorkers(2); } },
    { title: "Flooded Bridge", description: "An enemy destroyed a bridge, delaying trade.<br><br>description:<br>money -100", effect: () => { money -= 100; } },
    { title: "Beast Kills Livestock", description: "A wild animal attacked and killed livestock.<br><br>description:<br>food -70", effect: () => { food -= 70; } },
    { title: "Fire in the Village", description: "An unknown group set fire to a farming village.<br><br>description:<br>agriculture -2<br>happiness -5", effect: () => { agriculture = Math.max(0, agriculture - 2); happiness -= 5; } },
    { title: "Poisoned Well", description: "A saboteur poisoned a well. Some people died.<br><br>description:<br>population -20<br>business -10<br>agriculture -10", effect: () => { population -= 20; business = Math.max(0, business - 10); agriculture = Math.max(0, agriculture - 10); removeWorkers(20); } },
    { title: "Sabotage in the Market", description: "Explosives were planted near the central market.<br><br>description:<br>money -150", effect: () => { money -= 150; } },
    { title: "Thieves in the Night", description: "Thieves broke into a storage house and escaped with goods.<br><br>description:<br>food -60<br>money -60", effect: () => { food -= 60; money -= 60; } },
    { title: "Wolves Attack", description: "A pack of wolves hunted near your settlements.<br><br>description:<br>population -12<br>food -30<br>army -12", effect: () => { population -= 12; food -= 30; army = Math.max(0, army - 12); removeWorkers(12); } },
    { title: "Terrorist Plot Foiled", description: "A rebel plot was stopped, but panic spread.<br><br>description:<br>happiness -5<br>army -2<br>population -2", effect: () => { happiness -= 5; army = Math.max(0, army - 2); population -= 2; removeWorkers(2); } },
    { title: "Enemy Army Spotted", description: "A rival army was seen preparing nearby.<br><br>description:<br>happiness -15", effect: () => { happiness -= 15; } },
    { title: "Harassment by Pirates", description: "Pirates attacked coastal trade caravans.<br><br>description:<br>money -200<br>happiness -5", effect: () => { money -= 200; happiness -= 5; } },
    { title: "Mine Sabotaged", description: "A traitor blew up a part of the mine.<br><br>description:<br>money -100<br>business -10", effect: () => { money -= 100; business = Math.max(0, business - 10); } },
    { title: "Cattle Disease Spread", description: "An illness spread through your livestock.<br><br>description:<br>food -100", effect: () => { food -= 100; } },
    { title: "Secret Tunnel Breach", description: "Rebels tunneled under the wall and attacked a storage room.<br><br>description:<br>food -80<br>happiness -5", effect: () => { food -= 80; happiness -= 5; } }
  ],
  resistance: [
    { title: "Warehouse Plundered", description: "Angry rebels stormed the food stores.<br><br>description:<br>food -100<br>happiness -5", effect: () => { food -= 100; happiness -= 5; } },
    { title: "Weapons Stolen", description: "Rebels stole weapons from your armory.<br><br>description:<br>army -10<br>happiness -5", effect: () => { army = Math.max(0, army - 10); happiness -= 5; } },
    { title: "Castle Storm Attempt", description: "A rebellion tried to take the castle but failed.<br><br>description:<br>happiness -20", effect: () => { happiness -= 20; } },
    { title: "Tax Office Burned", description: "Rebels set fire to the local tax office.<br><br>description:<br>money -150", effect: () => { money -= 150; } },
    { title: "Rebel Propaganda", description: "Pamphlets and graffiti turn people against the leadership.<br><br>description:<br>happiness -10", effect: () => { happiness -= 10; } },
    { title: "Food Poisoning Scandal", description: "Rebels contaminated food to incite panic.<br><br>description:<br>food -50<br>population -5", effect: () => { food -= 50; population -= 5; removeWorkers(5); } },
    { title: "Rebel Leader Captured", description: "A rebel leader is caught and executed publicly.<br><br>description:<br>happiness +5", effect: () => { happiness += 5; } },
    { title: "Hidden Tunnel Found", description: "Rebels dug a tunnel to escape the city with resources.<br><br>description:<br>money -100", effect: () => { money -= 100; } },
    { title: "Militia Recruitment", description: "Civilians secretly trained by rebels rise up.<br><br>description:<br>army -15<br>happiness -10", effect: () => { army = Math.max(0, army - 15); happiness -= 10; } },
    { title: "Rebel Riot", description: "A violent riot erupts in the town square.<br><br>description:<br>happiness -15<br>population -10", effect: () => { happiness -= 15; population -= 10; removeWorkers(10); } },
    { title: "Market Fire", description: "Arsonists set fire to the central market.<br><br>description:<br>business -3<br>happiness -5", effect: () => { business = Math.max(0, business - 3); happiness -= 5; } },
    { title: "Civil Sabotage", description: "City workers disrupt daily operations to protest.<br><br>description:<br>agriculture -2<br>business -2", effect: () => { agriculture = Math.max(0, agriculture - 2); business = Math.max(0, business - 2); } },
    { title: "Water Wells Tainted", description: "Wells are poisoned in the outer districts.<br><br>description:<br>population -8<br>food -30", effect: () => { population -= 8; food -= 30; removeWorkers(8); } },
    { title: "Captured Officials", description: "Rebels kidnap and ransom local officials.<br><br>description:<br>money -200", effect: () => { money -= 200; } },
    { title: "Rural Uprising", description: "Farmers protest against food distribution policies.<br><br>description:<br>agriculture -5", effect: () => { agriculture = Math.max(0, agriculture - 5); } },
    { title: "Workshop Strike", description: "Craftsmen halt all production, demanding reforms.<br><br>description:<br>business -4", effect: () => { business = Math.max(0, business - 4); } },
    { title: "Defection in Ranks", description: "Several soldiers abandon their posts and join the rebellion.<br><br>description:<br>army -8", effect: () => { army = Math.max(0, army - 8); } },
    { title: "Looted Caravan", description: "A supply caravan was intercepted by rebels.<br><br>description:<br>food -70<br>money -100", effect: () => { food -= 70; money -= 100; } },
    { title: "Rebel Broadcast", description: "Messages of rebellion demoralize your people.<br><br>description:<br>happiness -8", effect: () => { happiness -= 8; } },
    { title: "Guerrilla Attack", description: "Hit-and-run tactics cause confusion and fear.<br><br>description:<br>population -6<br>army -3", effect: () => { population -= 6; army = Math.max(0, army - 3); removeWorkers(6); } }
  ],
  diplomacy: [
    { title: "Noble Visit", description: "A noble from a nearby region visits with lavish gifts.<br><br>descripition:<br>money + 300<br>happiness + 10", effect: () => { money += 300; happiness += 10; } },
    { title: "Political Banquet", description: "A grand banquet is held for visiting dignitaries.<br><br>descripition:<br>happiness + 5<br>money - 100", effect: () => { happiness += 5; money -= 100; } },
    { title: "Noble Dispute", description: "A heated argument with a visiting lord causes tension.<br><br>descripition:<br>happiness - 10", effect: () => { happiness -= 10; } },
    { title: "Alliance Proposal", description: "A neighboring territory proposes an alliance.<br><br>descripition:<br>happiness + 8", effect: () => { happiness += 8; } },
    { title: "Marriage Pact", description: "A political marriage strengthens your dynasty.<br><br>descripition:<br>happiness + 10", effect: () => { happiness += 10; } },
    { title: "Border Dispute", description: "An argument over land leads to diplomatic unrest.<br><br>descripition:<br>happiness - 5", effect: () => { happiness -= 5; } },
    { title: "Gift Exchange", description: "A formal gift exchange improves relationships.<br><br>descripition:<br>money - 50<br>happiness + 7", effect: () => { money -= 50; happiness += 7; } },
    { title: "Foreign Envoy", description: "An envoy from distant lands brings exotic items.<br><br>descripition:<br>money + 150<br>happiness + 5", effect: () => { money += 150; happiness += 5; } },
    { title: "Broken Agreement", description: "A neighbor breaks a previous treaty.<br><br>descripition:<br>happiness - 8", effect: () => { happiness -= 8; } },
    { title: "Cultural Festival", description: "A joint festival boosts morale.<br><br>descripition:<br>happiness + 12<br>food - 50", effect: () => { happiness += 12; food -= 50; } },
    { title: "Noble Demands Tribute", description: "A powerful noble demands payment to maintain peace.<br><br>descripition:<br>money - 200", effect: () => { money -= 200; } },
    { title: "Joint Military Parade", description: "Shared display of military might strengthens image.<br><br>descripition:<br>happiness + 4<br>army + 5", effect: () => { happiness += 4; army += 5; } },
    { title: "Envoy Insulted", description: "A foreign diplomat is unintentionally offended.<br><br>descripition:<br>happiness - 6", effect: () => { happiness -= 6; } },
    { title: "Trade Agreement Signed", description: "A profitable deal is signed with another territory.<br><br>descripition:<br>money + 250", effect: () => { money += 250; } },
    { title: "Tense Negotiations", description: "Talks nearly break down, but peace is maintained.<br><br>descripition:<br>happiness - 3", effect: () => { happiness -= 3; } },
    { title: "Local Uprising Supported Abroad", description: "A rival territory is accused of aiding rebels.<br><br>descripition:<br>happiness - 10<br>money - 100", effect: () => { happiness -= 10; money -= 100; } },
    { title: "Honor Duel", description: "A duel between nobles settles a dispute peacefully.<br><br>descripition:<br>happiness + 6", effect: () => { happiness += 6; } },
    { title: "Visiting Scholar", description: "A famous scholar shares ideas with your court.<br><br>descripition:<br>happiness + 5", effect: () => { happiness += 5; } },
    { title: "Diplomatic Gift Refused", description: "A rival rejects your offering, causing embarrassment.<br><br>descripition:<br>happiness - 5", effect: () => { happiness -= 5; } },
    { title: "Royal Tour", description: "A member of your court travels abroad, improving relations.<br><br>descripition:<br>happiness + 5<br>money - 50", effect: () => { happiness += 5; money -= 50; } }
  ],
  trade: [
    { title: "Pirate Raid", description: "Pirates attacked and plundered a merchant ship.<br><br>descripition:<br>money - 300", effect: () => { money -= 300; } },
    { title: "Bad Harvest", description: "The season's crops were poor due to bad weather.<br><br>descripition:<br>food - 200", effect: () => { food -= 200; } },
    { title: "Lucky Fishing", description: "A huge catch increases food supply and morale.<br><br>descripition:<br>food + 150<br>happiness + 5", effect: () => { food += 150; happiness += 5; } },
    { title: "Mining Boom", description: "You struck a rich vein of ore in your mines.<br><br>descripition:<br>money + 400", effect: () => { money += 400; } },
    { title: "Silk Caravan Arrives", description: "A caravan delivers luxury goods for high profit.<br><br>descripition:<br>money + 250", effect: () => { money += 250; } },
    { title: "Merchant Guild Tax", description: "The merchant guild imposes an unexpected tax.<br><br>descripition:<br>money - 150", effect: () => { money -= 150; } },
    { title: "Trade Route Established", description: "A new route opens, increasing commerce.<br><br>descripition:<br>business + 5<br>money + 100", effect: () => { business += 5; money += 100; } },
    { title: "Fire in the Market District", description: "A fire damages shops and stalls.<br><br>descripition:<br>business - 5<br>money - 50", effect: () => { business = Math.max(0, business - 5); money -= 50; } },
    { title: "Salt Trade Surge", description: "Demand for salt skyrockets.<br><br>descripition:<br>money + 200", effect: () => { money += 200; } },
    { title: "Foreign Currency Fluctuates", description: "Market instability affects prices.<br><br>descripition:<br>money - 100", effect: () => { money -= 100; } },
    { title: "Exotic Trader", description: "A foreign merchant brings rare items.<br><br>descripition:<br>money - 100<br>happiness + 5", effect: () => { money -= 100; happiness += 5; } },
    { title: "Flooded Fields", description: "Heavy rains destroyed farmland.<br><br>descripition:<br>food - 150<br>agriculture - 3", effect: () => { food -= 150; agriculture = Math.max(0, agriculture - 3); } },
    { title: "Black Market Activity", description: "Illegal trade rises under your nose.<br><br>descripition:<br>money + 100<br>happiness - 5", effect: () => { money += 100; happiness -= 5; } },
    { title: "Harvest Festival Trade", description: "The festival boosts local sales.<br><br>descripition:<br>money + 120<br>happiness + 5", effect: () => { money += 120; happiness += 5; } },
    { title: "Fishing Boat Lost", description: "A storm sank a large fishing vessel.<br><br>descripition:<br>food - 100", effect: () => { food -= 100; } },
    { title: "Smuggling Ring Uncovered", description: "Authorities seize contraband.<br><br>descripition:<br>money + 150", effect: () => { money += 150; } },
    { title: "Export Ban Lifted", description: "Trade restrictions are lifted, aiding commerce.<br><br>descripition:<br>money + 200<br>business + 2", effect: () => { money += 200; business += 2; } },
    { title: "Foreign Traders Embargo", description: "An embargo limits goods entering the region.<br><br>descripition:<br>money - 200", effect: () => { money -= 200; } },
    { title: "Prosperous Rice Trade", description: "A bumper rice crop sells well abroad.<br><br>descripition:<br>food - 100<br>money + 300", effect: () => { food -= 100; money += 300; } },
    { title: "Jewels Discovered", description: "Miners uncover a stash of gems.<br><br>descripition:<br>money + 500<br>happiness + 10", effect: () => { money += 500; happiness += 10; } }
  ],
  alert: [
    { title: "Yokai Sighting", description: "A strange creature was seen near the forest edge.<br><br>descripition:<br>happiness - 10", effect: () => { happiness -= 10; } },
    { title: "Ancient Ruins Discovered", description: "An expedition finds mysterious ruins nearby.<br><br>descripition:<br>money + 100", effect: () => { money += 100; } },
    { title: "Bandit Camp Spotted", description: "Scouts report a bandit hideout forming near the border.<br><br>descripition:<br>happiness - 5", effect: () => { happiness -= 5; } },
    { title: "Villagers Disappear", description: "Several villagers vanished near the mountains.<br><br>descripition:<br>population - 10<br>removeWorkers(10)", effect: () => { population -= 10; removeWorkers(10); } },
    { title: "Meteor Strike", description: "A meteor crashes nearby, causing panic.<br><br>descripition:<br>happiness - 8", effect: () => { happiness -= 8; } },
    { title: "Mysterious Fog", description: "A dense fog blankets the region. Farmers refuse to work.<br><br>descripition:<br>agriculture - 3", effect: () => { agriculture = Math.max(0, agriculture - 3); } },
    { title: "Wailing Heard at Night", description: "Citizens report ghostly wailing after sunset.<br><br>descripition:<br>happiness - 6", effect: () => { happiness -= 6; } },
    { title: "Wandering Beast Tracks", description: "Massive claw marks are found near the outer farms.<br><br>descripition:<br>food - 50", effect: () => { food -= 50; } },
    { title: "Cult Activity Suspected", description: "Suspicious gatherings spark rumors of heresy.<br><br>descripition:<br>happiness - 10", effect: () => { happiness -= 10; } },
    { title: "Abandoned Village Nearby", description: "A nearby village lies eerily empty.<br><br>descripition:<br>food + 50<br>happiness - 5", effect: () => { food += 50; happiness -= 5; } },
    { title: "Distant Drums", description: "Drums are heard echoing from the forest at night.<br><br>descripition:<br>happiness - 5", effect: () => { happiness -= 5; } },
    { title: "Unknown Illness", description: "A strange sickness spreads from a nearby settlement.<br><br>descripition:<br>population - 5<br>happiness - 5<br>removeWorkers(5)", effect: () => { population -= 5; happiness -= 5; removeWorkers(5); } },
    { title: "Monster Skeleton Found", description: "Giant bones unearthed by farmers intrigue the people.<br><br>descripition:<br>happiness + 5", effect: () => { happiness += 5; } },
    { title: "Military Movements", description: "Troop activity near the border stirs concern.<br><br>descripition:<br>happiness - 7", effect: () => { happiness -= 7; } },
    { title: "Spiritual Pilgrims Arrive", description: "Monks claim a vision led them to nearby hills.<br><br>descripition:<br>happiness + 6", effect: () => { happiness += 6; } },
    { title: "Collapsed Cave Entrance", description: "A cave-in reveals glinting ores inside.<br><br>descripition:<br>money + 200", effect: () => { money += 200; } },
    { title: "Old Battlefield Unearthed", description: "Remains of an ancient battle uncovered during plowing.<br><br>descripition:<br>happiness + 2<br>army + 5", effect: () => { happiness += 2; army += 5; } },
    { title: "Beast Howls", description: "Howls echo in the night, livestock is restless.<br><br>descripition:<br>food - 30", effect: () => { food -= 30; } },
    { title: "Shrine Appears Overnight", description: "A mysterious shrine is found fully formed by morning.<br><br>descripition:<br>happiness + 10", effect: () => { happiness += 10; } },
    { title: "Seismic Tremor", description: "A light earthquake shakes buildings.<br><br>descripition:<br>infrastructure - 5", effect: () => { infrastructure = Math.max(0, infrastructure - 5); } }
  ]
};

let eventModifiers = {
  food: 0, army: 0, happiness: 0, population: 0,
  agriculture: 0, money: 0, infrastructure: 0, business: 0
};

function aplicarEventosAleatorios() {
  const categories = Object.keys(randomEvents);
  const chosenCategories = [];

  while (chosenCategories.length < 2) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    if (!chosenCategories.includes(cat)) chosenCategories.push(cat);
  }

  const logDivs = document.querySelectorAll(".Random_event");

  chosenCategories.forEach((category, index) => {
    const events = randomEvents[category];
    const event = events[Math.floor(Math.random() * events.length)];

    const oldState = {
      food, army, happiness, population,
      agriculture, money, infrastructure, business
    };

    event.effect();

    eventModifiers.food += food - oldState.food;
    eventModifiers.army += army - oldState.army;
    eventModifiers.happiness += happiness - oldState.happiness;
    eventModifiers.population += population - oldState.population;
    eventModifiers.agriculture += agriculture - oldState.agriculture;
    eventModifiers.money += money - oldState.money;
    eventModifiers.infrastructure += infrastructure - oldState.infrastructure;
    eventModifiers.business += business - oldState.business;

    const html = `<div class="event-entry">
      <strong>${event.title}</strong><br>
      <em>${category}</em>: ${event.description}
    </div>`;
    if (logDivs[index]) logDivs[index].innerHTML = html;
  });
}

document.getElementById("Random_events").addEventListener("click", aplicarEventosAleatorios);


document.getElementById("Pass_turn").addEventListener("click", () => {
  let food = parseInt(document.getElementById("Food").value) || 0;
  let army = parseInt(document.getElementById("Army").value) || 0;
  let happiness = parseInt(document.getElementById("Happiness").value) || 0;
  let population = parseInt(document.getElementById("Population").value) || 0;
  let agriculture = parseInt(document.getElementById("Agriculture").value) || 0;
  let money = parseInt(document.getElementById("Money").value) || 0;
  let infrastructure = parseInt(document.getElementById("Infrastructure").value) || 0;
  let business = parseInt(document.getElementById("Business").value) || 0;

  let unemployed = 0;
  let foodChange = 0;
  let happinessChange = 0;
  let moneyChange = 0;
  let populationChange = 0;


  foodChange -= population;
  foodChange += agriculture * 3;

  if (food + foodChange > 0) happinessChange += 2;
  else happinessChange -= 5;

  moneyChange -= army;
  happinessChange += Math.floor(army / 10);

  if (happiness >= 40) populationChange += 10;
  if (happiness < 20) happinessChange -= 10;
  if (happiness >= 70) {
    foodChange += 5;
    moneyChange += 5;
  }

  moneyChange += population * 2;
  moneyChange -= infrastructure;

  if (infrastructure >= population + 10) happinessChange += 2;
  if (infrastructure < population) happinessChange -= 7;

  moneyChange += business * 3;

  const inputs = document.querySelectorAll("#Event_effect input");
  eventModifiers.food += parseInt(inputs[0].value) || 0;
  eventModifiers.army += parseInt(inputs[1].value) || 0;
  eventModifiers.happiness += parseInt(inputs[2].value) || 0;
  eventModifiers.population += parseInt(inputs[3].value) || 0;
  eventModifiers.agriculture += parseInt(inputs[4].value) || 0;
  eventModifiers.money += parseInt(inputs[5].value) || 0;
  eventModifiers.infrastructure += parseInt(inputs[6].value) || 0;
  eventModifiers.business += parseInt(inputs[7].value) || 0;


  food += foodChange + eventModifiers.food;
  money += moneyChange + eventModifiers.money;
  happiness = Math.max(0, Math.min(100, happiness + happinessChange + eventModifiers.happiness));
  population += populationChange + eventModifiers.population;
  army += eventModifiers.army;
  agriculture += eventModifiers.agriculture;
  infrastructure += eventModifiers.infrastructure;
  business += eventModifiers.business;

  let usedPopulation = agriculture + business + army;
  unemployed = population - usedPopulation;
  if (unemployed < 0) unemployed = 0;

  document.getElementById("Food").value = food;
  document.getElementById("Army").value = army;
  document.getElementById("Happiness").value = happiness;
  document.getElementById("Population").value = population;
  document.getElementById("Agriculture").value = agriculture;
  document.getElementById("Money").value = money;
  document.getElementById("Infrastructure").value = infrastructure;
  document.getElementById("Business").value = business;

  alert(`Turn passed (6 months):

+ ${foodChange + eventModifiers.food} Food
+ ${moneyChange + eventModifiers.money} Money
+ ${happinessChange + eventModifiers.happiness} Happiness
+ ${populationChange + eventModifiers.population} Population
+ ${eventModifiers.agriculture} Agriculture
+ ${eventModifiers.infrastructure} Infrastructure
+ ${eventModifiers.business} Business
+ ${eventModifiers.army} Army
Unemployed: ${unemployed}
`);

  document.querySelectorAll("#Event_effect input").forEach(input => input.value = "");

  eventModifiers = {
    food: 0,
    army: 0,
    happiness: 0,
    population: 0,
    agriculture: 0,
    money: 0,
    infrastructure: 0,
    business: 0
  };
});


//Big_NPCs
const clanData = {
  Oda: {
    description: `<h2>Clan description</h2> <br> 
    During the war against the Imagawa Clan, the Oda Clan emerged as an ambitious, daring force. Based in Owari, it is known for military charisma and the break with feudal traditions. In the fantasy world, the Oda are feared for their Tengu bloodline, which grants powers of wind and illusion.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Tengu** <br> 
Bird-like yokai linked to wind, mountains, and martial arts.  <br> 
- Retractable Wings (short-distance flight)  <br> 
- Scarlet Eyes (night vision, lie detection)  <br> 
- Wind Manipulation (cutting gusts, wind shields)  <br> 
- Phantom Sword (weapon made of solid wind)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: None  <br> 
**Enemies**: Tokugawa, Imagawa`,
    characters: `<h2>Characters</h2> <br>
    - **Oda Nobunaga** <br> 
     – Arcane Warrior, Clan leader. Wind-magic samurai of brutal ambition.  <br> <br> 
- **Oichi** <br> 
– Blood Shaman. Nobunaga’s sister and spiritual channeler.  <br> <br> 
- **Oda Nobuyuki** <br> 
– Arcane Knight. Traitor brother with wind defenses.  <br> <br> 
- **Oda Nobukatsu** <br> 
– Illusionary Swordsman. Young heir, wields blade illusions.  <br> <br> 
- **Oda Nobutaka** <br> 
– Wind Master. Silent and fast elite bodyguard.`,
    vassals: `<h2>Vassals</h2> <br>
    - **Toyotomi (Hideyoshi)** <br> 
    – Bake-danuki. Master of shapeshifting and illusions.  <br> <br> 
- **Shibata (Katsuie)** <br> 
– Yuki-onna. Frost Knight who weakens enemies.  <br> <br> 
- **Maeda (Toshiie)** <br> 
– Phoenix Paladin. Dies and revives in flames.  <br> <br> 
- **Niwa (Nagahide)** <br> 
– Hō-ō. Tactician with morale-boosting light magic.  <br> <br> 
- **Ikeda (Tsuneoki)** <br> 
– Raijū. Thunder warrior who strikes like a storm.`
  },

  Tokugawa: {
    description: `<h2>Clan description</h2> <br>
    The Tokugawa Clan, descended from the Matsudaira, values order and longevity. Ieyasu, though under Imagawa control, is a strategic genius. Their bloodline comes from the ancient Minogame — a wise, near-immortal turtle yokai.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Minogame**  <br> 
Yokai turtle of longevity and spiritual defense.  <br> 
- Spiritual Shell (natural magical defense)  <br> 
- Aura of Patience (enhances strategy and resistance)  <br> 
- Time Projection (brief slow-motion perception)  <br> 
- Spiritual Longevity (resistance to curses, slow healing)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: Imagawa  <br> 
**Enemies**: Oda`,
    characters: `<h2>Characters</h2> <br>
    - **Tokugawa Ieyasu** <br> 
    – Spiritual Strategist. Long-game tactician and diplomat.`,
    vassals: `<h2>Vassals</h2> <br>
    - **Honda (Tadakatsu)** <br> 
    – Niō. Wrathful Paladin with divine protection.  <br> 
Super strength, divine aura, and unstoppable spear-user.`
  },

  Imagawa: {
    description: `<h2>Clan description</h2> <br>
    From the coastal Suruga region, the Imagawa Clan combines courtly elegance with oceanic terror. Their bloodline, Umi-bōzu, stems from deep-sea spirits feared by sailors.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Umi-bōzu**  <br> 
Giant ocean yokai that drown and curse.  <br> 
- Liquid Body (can evade attacks by liquefying)  <br> 
- Water Manipulation (tentacles, water blasts)  <br> 
- Spiritual Pressure (induces fear)  <br> 
- Call of the Deep (summons aquatic creatures, fog)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: Tokugawa (vassal), Hōjō, Takeda  <br> 
**Enemies**: Oda`,
    characters: `<h2>Characters</h2> <br>
    - **Imagawa Yoshimoto** <br> 
    – Storm Monk. Pompous yet deadly tide-conjurer.  <br> <br> 
- **Sena** <br> 
– Mist Priestess. Wife of Ieyasu, uses mist for concealment.`,
    vassals: `<h2>Vassals</h2> <br>
    - **Okabe (Motonobu)** <br> 
    – Nue. Soul Hunter with poisonous aura, illusions, and shape-shifting terror.`
  },

  Saito: {
    description: `<h2>Clan description</h2> <br>
    The Saitō Clan once ruled Mino with fear and Oni strength. Their current state is one of decline, chaos, and fury — powered by the demonic Aka Oni bloodline.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Aka Oni**  <br> 
Red demons of rage and destruction.  <br> 
- Demonic Strength (break armor with punches)  <br> 
- Oni War Cry (intimidates enemies)  <br> 
- Infernal Resistance (ignore pain)  <br> 
- Berserker Rupture (rage boosts power when wounded)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: None  <br> 
**Enemies**: Oda`,
    characters: `<h2>Characters</h2> <br>
    - **Saitō Yoshitatsu** <br> 
    – Infernal Berserker. Parricide warlord in demonic frenzy.  <br> <br> 
- **Nōhime** <br> 
– Lady of Hidden Flames. Subtle, venomous emissary married to Nobunaga.  <br> <br> 
- **Saitō Toshimitsu** <br> 
– Bloody Warrior. Loyal general with brutal strength.`,
    vassals: `<h2>Vassals</h2> <br>
    - **Akeshi (Mitsuhide)** <br> 
    – Tsukumogami Blade. Spirit Duelist with living sword.  <br> <br> 
- **Hanbei (Takenaka)** <br> 
– Karakasa-obake. Illusionist Tactician with weather control.`
  },

  Ashikaga: {
    description: `<h2>Clan description</h2> <br>
    The Ashikaga hold the symbolic title of Shogun in a collapsing Kyoto. Their Kumo-no-Kami bloodline, tied to spider gods, grants them power over manipulation and illusions.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Kumo-no-Kami**  <br> 
Spider deity of subtlety and fate-weaving.  <br> 
- Spirit Weaving (immobilize or control objects)  <br> 
- Subtle Poison (influence via touch or voice)  <br> 
- Web Sensitivity (sense intent through vibrations)  <br> 
- Shadow of the Shogun (summon spiritual avatars)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: None (symbolic ties only)  <br> 
**Enemies**: Rokkaku, Miyoshi`,
    characters: `<h2>Characters</h2> <br>
    - **Ashikaga Yoshiteru** <br> 
    – Illusionist Shogun. Traps, illusions, mind games.  <br> <br> 
- **Ashikaga Yoshiaki** <br> 
– Web Oracle. Future schemer allied to spirits.`,
    vassals: `<h2>Vassals</h2> <br>
    Symbolic nobles with weakened loyalty; most real vassals lost.`
  },

  Kitabatake: {
    description: `<h2>Clan description</h2> <br>
    Guardians of Ise’s sacred forests, the Kitabatake Clan oppose Nobunaga’s advance with spiritual harmony. Their Kodama bloodline stems from ancient tree spirits.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Kodama**  <br> 
Forest spirits of balance and protection.  <br> 
- Living Wood Body (bark-like defense)  <br> 
- Call of the Forest (roots, thorns to trap)  <br> 
- Earth Regen (faster healing in sacred terrain)  <br> 
- Harmony Aura (soothes lesser yokai)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: Shrine clergy, mountain clans  <br> 
**Enemies**: Oda`,
    characters: `<h2>Characters</h2> <br>
    - **Tomonori** <br> 
    – Druidic Warrior. Sacred naginata user, protector of forests.  <br> <br> 
- **Aki** <br> 
– Green Mist Archer. Forest-trained guardian with spirit-guided arrows.  <br> <br> 
- **Harumoto** <br> 
– Earth High Priest. Ritual leader with deep yokai ties.`,
    vassals: `<h2>Vassals</h2> <br>
    Faith-based allies and shrine guardians.`
  },

  Rokkaku: {
    description: `<h2>Clan description</h2> <br>
    An insurgent clan from Ōmi, the Rokkaku believe in strength and vision. They inherit the Taka-no-Kami bloodline — divine hawks of strategy and aerial power.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Taka-no-Kami**  <br> 
Hawk gods of the sky and precision.  <br> 
- Hunting Vision (see spiritual weak points)  <br> 
- Aerial Charge (diving glides)  <br> 
- Wind Claws (wind slashes with weapons)  <br> 
- Sentinel of the Sky (perceive ambushes)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: Minor clans, anti-Ashikaga groups  <br> 
**Enemies**: Ashikaga, Oda (occasionally)`,
    characters: `<h2>Characters</h2> <br>
    - **Yoshikata** <br> 
    – Political Hunter. Meritocratic leader, hard to ambush.  <br> <br> 
- **Jikei** <br> 
– Flying Archer. Commands hawk-like aerial troops.  <br> <br> 
- **Soen** <br> 
– Spirit Shaman. Hunter of corrupted spirits, quiet prophet.`,
    vassals: `<h2>Vassals</h2> <br>
    Insurgent clans and air-based troops.`
  },

  Miyoshi: {
    description: `<h2>Clan description</h2> <br>
    Shadow rulers of Kyoto, the Miyoshi command trade, politics, and the underworld. Their Orochi bloodline, from the eight-headed serpent, symbolizes manipulation and rebirth.`,
    lineage: `<h2>Lineage</h2> <br>
    **Bloodline: Yamata-no-Orochi**  <br> 
Serpent yokai of multiple heads and corruption.  <br> 
- Presence Multiplication (clones or partial heads)  <br> 
- Political Poison (corrupting words)  <br> 
- Internal Regeneration (survive fatal wounds)  <br> 
- Subterranean Rifts (teleport via shadows)  <br> 
- Aura of Silent Intimidation (induces instinctive fear)`,
    alliesEnemies: `<h2>Allies and Enemies</h2> <br>
    **Allies**: Matsunaga, corrupted nobles  <br> 
**Enemies**: Ashikaga, Oda, independent monks`,
    characters: `<h2>Characters</h2> <br>
    - **Nagayoshi** <br> 
    – Serpent Lord. Master of spies and court control.  <br> <br> 
- **Jikkyu** <br> 
– Poison Weaver. Ritualist shaman of spiritual toxins.  <br> <br> 
- **Yoshitsugu** <br> 
– Sneaky Duelist. Agile commander with poison blade.`,
    vassals: `<h2>Vassals</h2> <br>
    Assassins, corrupt priests, and bureaucrats of the “Serpent Court”.`
  }
};

function loadClanData(clanName) {
  const data = clanData[clanName];
  if (!data) return;

  document.getElementById("Clan_top").innerHTML = data.description;
  document.getElementById("Clan_mid_1").innerHTML = data.lineage;
  document.getElementById("Clan_mid_2").innerHTML = data.alliesEnemies;
  document.getElementById("Clan_mid_3").innerHTML = data.characters;
  document.getElementById("Clan_buttom").innerHTML = data.vassals;

  document.querySelector(".Target_clan").textContent = `${clanName}`;
}

document.querySelectorAll("#NPCs_Clas_name p").forEach(p => {
  p.addEventListener("click", () => {
    const clanName = p.textContent.trim();
    loadClanData(clanName);
  });
});





//War Sistem - Moral
const moraleDescriptions = {
  1: `Total Collapse<br>Description: The army is defeated.<br>They surrender, flee, or are captured.<br>Effects:<br>Troops abandon the fight or surrender.<br>Mages flee, surrender, or are killed.<br>Commanders are captured or killed.<br>End of battle: They become hostages or survivors scattered.`,
  2: `Panic<br>Description: Troops in complete despair. Orders are ignored.<br>Effects:<br>Every round: Morale roll to avoid escape.<br>Mages cast escape spells or abandon the field.<br>Possible betrayal or abandonment of allies.`,
  3: `Formation Break<br>Description: Troops hesitate, abandon formations, some flee.<br>Effects:<br>-1 to attack or defense rolls.<br>Mages refuse area spells or do not position themselves.<br>Reinforcements do not arrive or retreat.<br>Enemies receive a morale bonus (+1).`,
  4: ` Weak Morale<br>Description: There is fear, but there is still some order.<br>Effects:<br>Commander must constantly motivate (charisma or leadership test).<br>Mages only cast defensive or healing spells.<br>A negative event (leader death, surprise attack) can drop to 1-2.`,
  5: `Unstable Morale<br>Description: Troops are tired, but they obey. Victory is still possible.<br>Effects:<br>Mages continue to act cautiously.<br>Morale checks for each major setback.<br>Troops fight best with direct support from the leader.`,
  6: `Balanced Morale<br>Description: The army stands firm but alert. No visible fear.<br>Effects:<br>Mages operate with moderate confidence.<br>Troops follow orders, with no bonuses or penalties.<br>A heroic event can boost morale.`,
  7: `Good Morale<br>Description: Confidence begins to spread. Victory seems possible.<br>Effects:<br>+1 to saving throws or initiative.<br>Mages launch coordinated offensives.<br>Troops follow orders zealously.`,
  8: `High Morale<br>Description: Spirit of victory. Everyone is aligned and motivated.<br>Effects:<br>Troops advance with courage.<br>Mages use powerful spells without fear.<br>Can attract allies, reinforcements or inspire other armies.<br>Enemies begin to retreat (enemy morale test).`,
  9: `Inspired Morale<br>Description: The army is seen as invincible. Contagious morale.<br>Effects:<br>Advantage on morale and strategy tests.<br>Mages activate grand rituals and epic offensive spells.<br>Reinforcements appear spontaneously or distant allies unite.`,
  10: `Glorious Victory<br>Description: The army has triumphed! Ready to meet the general or complete the objective.<br>Effects:<br>Enemies surrender or flee.<br>Commanders are praised; leaders gain influence.<br>Morale does not drop for 1 day, even with minor negative events.<br>Can unlock special events or narrative rewards.`
};

function updateDescription(value) {
  const description = moraleDescriptions[value];
  const descElement = document.getElementById("Description_morale");

  if (descElement) {
    descElement.innerHTML = description || "Invalid morale value.";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const inputMoral = document.getElementById('moral');

  inputMoral.addEventListener('input', function () {
    const value = parseInt(this.value);
    if (!isNaN(value)) {
      updateDescription(value);
    }
  });

  updateDescription(parseInt(inputMoral.value));
});



//War Sistem - Events
const warEventDescriptions = {
  War: {
    1: `Total Ambush: The group is caught off guard by a coordinated ambush. Test perception and defense or they are surrounded by enemies.`,
    2: `Rain of Arrows: A hail of arrows covers the sky. Everyone makes dodge or defense tests (Aura, Dexterity or shields).`,
    3: `Area Magic - Ice Spikes: An enemy mage conjures spikes that sprout from the ground. Test to avoid or reduce the damage (magic, resistance).`,
    4: `Wounded Ally Calls for Help: A samurai ally, important to the mission, will be wounded nearby. Helping may cost time and effort, but may guarantee loyalty or information.`,
    5: `Magic Barrier Blocks Path: A spiritual barrier appears in the middle of the advance. Request ritual, faith or massive damage to be broken.`,
    6: `Shakespeare Torrential Rain: A sudden onset that affects arrow shots, visibility and position. Ranged and acrobatics penalties.`,
    7: `Ally Causes Panic: An allied soldier becomes desperate and begins to flee, dragging others with him. Social check to prevent mass desertion.`,
    8: `Minor Earthquake - Magic or Yokai: The ground shakes, making movement difficult. Balance or dexterity checks to avoid falling. Possible trap by a Yokai.`,
    9: `Intercepted Messenger: A messenger with important orders is captured by enemies. The group can try to save him.`,
    10: `Civilian Refugees in the Middle of Battle: A group of civilians appears between the lines of combat. Saving or ignoring can affect honor, faith, or trust.`,
    11: `Strategic Opportunity: An enemy flank becomes vulnerable for a brief moment. If the group acts quickly, it can turn the fight around.`,
    12: `Neutral Reinforcements Arrive: A neutral clan or force observes the fight and can choose a side (social test, politics, or luck).`,
    13: `Ally Joins the Fight: An allied general appears with soldiers, balancing the fight in the group's favor.`,
    14: `Duel with Enemy Champion: An enemy champion or commander challenges the group or a character to a duel. Victory can break enemy morale.`,
    15: `Enemy Joins the Fight Against the Group: An enemy Yokai, mercenary, or general enters to reinforce the other side.`,
    16: `Yokai Gets Out of Control: A Yokai released by one side attacks indiscriminately, becoming a threat to all.`,
    17: `Allies Take Objective: Allied troops take over an important point (tower, gate, hill), giving them a tactical advantage.`,
    18: `Enemies Conquer Objective: Enemies take a vital point — the situation gets complicated. Group morale is shaken.`,
    19: `Blessing of a Local Kami: A Kami favors the group for their past actions (healing, bonuses, protective aura for turns).`,
    20: `Morale Explosion and Local Victory: Group troops have a sudden victory that inspires everyone. Bonus on tests for a while (strength, faith, aura, etc.).`
  },

  Trip: {
    1: `<strong>SOCIAL ENCOUNTERS</strong><br><u>Group of Travelers or Merchants</u><br>– Can be nomads, artists, pilgrims, a caravan of nobles, etc.<br>– Can be friendly, hostile, or ambiguous.`,
    2: `<strong>SOCIAL ENCOUNTERS</strong><br><u>Lone Traveler</u><br>– A wanderer, warrior, old wizard, or someone wounded and mysterious.<br>– May ask for help, offer information, or hide intentions.`,
    3: `<strong>SOCIAL ENCOUNTERS</strong><br><u>Group of Itinerant Merchants</u><br>– Sells rare or exotic items.<br>– Some are honorable, others are con artists. There may be something magical involved.`,
    4: `<strong>SOCIAL ENCOUNTERS</strong><br><u>Patrol, Guards, or Militia</u><br>– Agents of a city or feudal lord.<br>– May collect taxes, check documents, or pursue fugitives.`,
    5: `<strong>SOCIAL ENCOUNTERS</strong><br><u>Call for Help</u><br>– A call from the forest, a letter on the way, or someone running away from something.<br>– May be real or a trap.`,

    6: `<strong>HOSTILE ENCOUNTERS</strong><br><u>Bandits or Raiders</u><br>– Ambush. They want to loot, kill, or capture.<br>– They may be disorganized or led by someone more dangerous.`,
    7: `<strong>HOSTILE ENCOUNTERS</strong><br><u>Slave Hunters</u><br>– They try to capture the party or its allies.<br>– They may be acting on their own or in the service of an organization.`,
    8: `<strong>HOSTILE ENCOUNTERS</strong><br><u>Common Monsters</u><br>– Wolves, goblins, kobolds, weak undead, etc.<br>– Direct encounter, easy to run away from or deal with.`,
    9: `<strong>HOSTILE ENCOUNTERS</strong><br><u>Unique Monster or Notable Creature</u><br>– A rare or legendary beast.<br>– May be territorial, cursed, or part of an upcoming quest.`,
    10: `<strong>HOSTILE ENCOUNTERS</strong><br><u>Ongoing Conflict</u><br>– Two groups already fighting (e.g. bandits vs. merchants).<br>– Players can get involved, observe, or take advantage.`,

    11: `<strong>SPECIAL LOCATIONS</strong><br><u>Abandoned Haven</u><br>– A hut, hunter's house, shrine.<br>– May contain useful items, secrets, or traps.`,
    12: `<strong>SPECIAL LOCATIONS</strong><br><u>Humanoid Settlement (Town or City)</u><br>– Poor, rich, ruined, ghostly, or overrun by criminals.<br>– May bring new opportunities or threats.`,
    13: `<strong>SPECIAL LOCATIONS</strong><br><u>Mystical Place or Dungeon</u><br>– Entrance to a magical cave, forgotten ruins, ancient altar.<br>– May contain monsters, puzzles, treasures, or curses.`,
    14: `<strong>SPECIAL LOCATIONS</strong><br><u>Lost Treasure or Artifact</u><br>– A magical or valuable item appears randomly.<br>– May attract unwanted attention.`,
    15: `<strong>SPECIAL LOCATIONS</strong><br><u>Blocked Path / Obstacle</u><br>– Broken bridge, flooded path, magical gate.<br>– Requires creative solution or use of skills.`,

    16: `<strong>NATURAL AND SUPERNATURAL EVENTS</strong><br><u>Intense Weather Event</u><br>– Blizzard, thunderstorm, extreme heat, arcane fog.<br>– May make travel difficult or conceal dangers.`,
    17: `<strong>NATURAL AND SUPERNATURAL EVENTS</strong><br><u>Terrain or Wild Magic Trap</u><br>– Uncontrolled magic, cursed field, illusory well.<br>– May affect the party or surroundings for a time.`,
    18: `<strong>NATURAL AND SUPERNATURAL EVENTS</strong><br><u>Supernatural/Spiritual Event</u><br>– Vision, whispers, apparitions, entities.<br>– May be a warning, reward, or curse.`,
    19: `<strong>NATURAL AND SUPERNATURAL EVENTS</strong><br><u>Encounter with Non-Hostile Creatures</u><br>– Faeries, spirits, magical animals, or natural guardians.<br>– Interactions may grant blessings, curses, or knowledge.`,
    20: `<strong>NATURAL AND SUPERNATURAL EVENTS</strong><br><u>Crime Scene/Abandoned Body</u><br>– Site of recent combat, destroyed camp, corpse with clues.<br>– May lead to another quest, trap, or clue to a greater threat.`
  },

  Place: {
    1: `A traditional festival begins — with dancing, tasting, drinking... and a possible disappearance during the night.`,
    2: `Nothing happens.`,
    3: `A foreign merchant offers rare or cursed items, depending on a perception or intuition test.`,
    4: `A group of ronin causes trouble in the local tavern — they want to intimidate, duel, or cause trouble.`,
    5: `A wandering monk asks for shelter and begins reciting prophecies.`,
    6: `Children are disappearing — there is talk of a "shadow man" who appears after the temple bell rings.`,
    7: `The mayor/important location has been poisoned. The players are the suspects or the only ones capable of investigating.`,
    8: `An old letter is found by one of the characters — they are under guard by shinobs.`,
    9: `The village shrine has its offerings destroyed, and the local Kami is angry — nature begins to change.`,
    10: `An urban spirit (lesser Yokai) is playing tricks on the residents: pranks that can escalate.`,
    11: `A villager recognizes the group from another story or rumor and wants revenge or help.`,
    12: `A samurai from another clan challenges one of the characters out of honor, ideology, or pure ego.`,
    13: `The village is hit by black rain or strange fog—something corrupts the animals and plants.`,
    14: `A three-tailed cat follows the characters for days—is it good luck or a spiritual spy?`,
    15: `A blind old man offers a fortune-telling—with a dark warning and a test to decipher its veracity.`,
    16: `An ancient underground prison is discovered after a cave-in. Has anything been freed?`,
    17: `A fugitive noble couple seeks shelter from the group—they are being pursued by assassins or demons in disguise.`,
    18: `A spiritual disease begins to spread—cure requires a ritual, or exorcism by an infiltrated Yokai.`,
    19: `A traveling theater group arrives, but the actors are not what they seem—Yokai, disguised Oni, or spies?`,
    20: `An unusual celestial event (blue moon, eclipse) occurs—spirits emerge and reveal something hidden or begin a hunt.`
  }
};

function updateWarDescription(value) {
  const type = document.getElementById("events_option").value;
  const descElement = document.getElementById("Description_d20");

  const description = warEventDescriptions[type]?.[value];

  if (descElement) {
    descElement.innerHTML = description || "Invalid event or value.";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("D20_war");
  const select = document.getElementById("events_option");

  input.addEventListener("input", function () {
    const value = parseInt(this.value);
    if (!isNaN(value)) {
      updateWarDescription(value);
    }
  });

  select.addEventListener("change", function () {
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      updateWarDescription(value);
    }
  });

  updateWarDescription(parseInt(input.value));
});


//War Sitem - Karma
const karmaEventDescriptions = {
  Social_Meetings: [
    {
      range: [-100, -91],
      text: `– Hostile NPCs or preemptive ambushes.<br>– Shrines, patrols and merchants avoid, curse or denounce.`
    },
    {
      range: [-90, -71],
      text: `– Negative rumors cause nervous or violent reactions.<br>– Yokai and shadowy figures approach to manipulate or use the character.`
    },
    {
      range: [-70, -51],
      text: `– Guards observe or follow discreetly, possible blackmail.<br>– Merchants demand absurd prices or refuse to sell.`
    },
    {
      range: [-50, -31],
      text: `– Social tests with increased difficulty; cold or evasive answers.<br>– Help denied by travelers and religious people prevent approach.`
    },
    {
      range: [-30, -11],
      text: `– Uncomfortable NPCs, charging too much or refusing services.<br>– Trade exchanges made quickly and with ill will.`
    },
    {
      range: [-10, 0],
      text: `– Variable reactions: curiosity, distrust or respectful distance.<br>– Some NPCs offer help if morally tested first.`
    },
    {
      range: [1, 10],
      text: `– Direct but impersonal interactions. Conversations require strong arguments.<br>– Normal social tests, without spontaneous help.`
    },
    {
      range: [11, 30],
      text: `– NPCs open to dialogue, listen to the character attentively.<br>– Receive useful information, tips or occasional help without charge.`
    },
    {
      range: [31, 50],
      text: `– Merchants offer discounts or show rare items.<br>– Benevolent or mysterious Yokai appear with curiosity.`
    },
    {
      range: [51, 70],
      text: `– Priests and travelers offer blessings, cures or advice.<br>– NPCs ask for company or protection in exchange for favors.`
    },
    {
      range: [71, 90],
      text: `– Guards and leaders listen to the character before acting.<br>– NPCs volunteer to help with missions or bring resources.`
    },
    {
      range: [91, 100],
      text: `– Unexpected encounters with NPCs who admire past achievements.<br>– Receive gifts, access to secret paths or personal prophecies.`
    }
  ],

  Hostile_Encounters: [
    {
      range: [-100, -91],
      text: `– Enemies recognize you and attack you with hatred or sadistic pleasure.<br>– A bounty on your head may attract more attackers.`
    },
    {
      range: [-90, -71],
      text: `– Encounters turn into violent pursuits, even from a distance.<br>– Creatures or bandits try to capture you alive for revenge or torture.`
    },
    {
      range: [-70, -51],
      text: `– Enemies come prepared with ambushes or traps.<br>– Leaders among the hostiles want to use the character as an example.`
    },
    {
      range: [-50, -31],
      text: `– Chances for dialogue are almost zero; threats or provocations are common.<br>– Some attack out of fear, as if it were an inevitable threat.`
    },
    {
      range: [-30, -11],
      text: `– Hostiles surround you before attacking, with mockery or intimidation.<br>– Enemies hesitate, but act with distrust and restrained violence.`
    },
    {
      range: [-10, 0],
      text: `– Aggressors may speak before attacking (negotiating, intimidating, sizing up opponents).<br>– Hostility may arise as a reaction to minimal provocation.`
    },
    {
      range: [1, 10],
      text: `– Some opponents listen to brief arguments before attacking.<br>– Combat can be avoided if the group retreats immediately.`
    },
    {
      range: [11, 30],
      text: `– Hostiles react with hesitation or brief curiosity (“Are you the one...?”).<br>– May propose an ultimatum, demand, or ritual challenge before attacking.`
    },
    {
      range: [31, 50],
      text: `– Enemy leader may recognize the character and offer a chance for limited dialogue.<br>– Chance of turning into a confrontation with rules (1v1, agreement, or honor).`
    },
    {
      range: [51, 70],
      text: `– Less fanatical enemies are intimidated or ask to surrender with honor.<br>– Rival factions among the hostiles may discuss how to deal with the character.`
    },
    {
      range: [71, 90],
      text: `– Enemies acknowledge previous deeds, and may offer surrender or a proposal.<br>– Possible conversion of one of the hostiles into a hesitant ally. `
    },
    {
      range: [91, 100],
      text: `– The character’s presence generates momentary doubt or reverence.<br>– Rational opponents may give the target a chance to speak before the final fight, respecting the target’s reputation.`
    }
  ],

  Special_Locations: [
    {
      range: [-100, -91],
      text: `– The location reacts negatively to the character’s presence (gates seal, traps activate on their own).<br>– Cursed or illusory treasures; what is found attracts enemies.`
    },
    {
      range: [-90, -71],
      text: `– Presence attracts hostile or corrupted entities from the location.<br>– Items found have bad or cursed secondary effects.<br>– The location may change geography (darkness, fog, disorientation).`
    },
    {
      range: [-70, -51],
      text: `– Encounters more enemies than normal (guarded, infested).<br>– Doors and paths are difficult to open, some challenges ignore luck.<br>– Perception or navigation checks have penalties.`
    },
    {
      range: [-50, -31],
      text: `– Resources are scarce or damaged (broken items, expired potions).<br>– Enemies have terrain bonuses (advantages, cover).`
    },
    {
      range: [-30, -11],
      text: `– The location appears “neutral,” but hidden opportunities do not reveal themselves.<br>– Shrines or sacred seals do not respond to the character.`
    },
    {
      range: [-10, 0],
      text: `– The location reacts in a mixed way: traps can be avoided, but there are no blessings or spiritual help.<br>– Minor events or strange encounters occur (sounds, shadows, illusions).`
    },
    {
      range: [1, 10],
      text: `– Treasures or information found are functional, but common.<br>– The place remains silent, with no clear supernatural reaction.`
    },
    {
      range: [11, 30],
      text: `– Secret elements begin to reveal themselves: hidden passages, ancient inscriptions, artifacts.<br>– The energy of the place does not interfere with the players.`
    },
    {
      range: [31, 50],
      text: `– Rare items or spiritual rewards are more accessible.<br>– The number of enemies may be smaller, or even avoid direct combat.`
    },
    {
      range: [51, 70],
      text: `– Shrines respond: healing, visions or temporary protection.<br>– The place seems to guide the characters (bonus to investigation tests, luck in events).`
    },
    {
      range: [71, 90],
      text: `– Kami or spirits manifest to offer guidance or spiritual tests.<br>– Powerful artifacts recognize the character and activate hidden properties.`
    },
    {
      range: [91, 100],
      text: `– The place changes around the character: traps are disarmed, portals open, the environment cooperates with his presence.<br>– Presence of unique blessings, ancestral messages or rare guardian spirits.`
    }
  ],

  Natural_and_Supernatural_Events: [
    {
      range: [-100, -91],
      text: `– Natural phenomena turn against the character: blizzards follow his steps, thunder surrounds him, fog selectively impedes vision.<br>– Visions or apparitions are threatening, tempting, or maddening.<br>– Spirits recognize him as a threat; even animals avoid or attack him.`
    },
    {
      range: [-90, -71],
      text: `– Magical traps become more unstable in his presence.<br>– Supernatural events induce paranoia, or bring minor curses.<br>– Non-hostile creatures become hostile or hide.`
    },
    {
      range: [-70, -51],
      text: `– Phenomena become confusing or misleading: fog shows false paths, voices contradict each other.<br>– Presences attempt to draw the character away from the location, or test his willpower with nightmares, noises, or illusions.`
    },
    {
      range: [-50, -31],
      text: `– Events occur normally, but with no chance of positive interaction.<br>– Visions are vague, fragmented, with side effects (fatigue, headache, temporary confusion).`
    },
    {
      range: [-30, -11],
      text: `– Possible blessings of events do not manifest.<br>– Magical creatures observe from a distance, but refuse to interact.`
    },
    {
      range: [-10, 0],
      text: `– Reactions of events are random: they can favor, hinder or pass by completely ignored.<br>– Presences can appear with symbolic, confusing or contradictory messages.`
    },
    {
      range: [1, 10],
      text: `– Natural events are intense, but without a clear destination.<br>– Supernatural creatures watch you with cautious curiosity, without taking the initiative.<br>– An encounter or vision may occur, but without immediate effect.`
    },
    {
      range: [11, 30],
      text: `– Spirits approach with enigmatic messages or moral tests.<br>– Magical animals or natural entities accept your presence, and may offer hints or discreet protection.`
    },
    {
      range: [31, 50],
      text: `– Apparitions or visions bring clear warnings or small benefits (inspiration, mild healing, a sense of direction).<br>– Fairies or minor kami leave clues, footprints, symbols.`
    },
    {
      range: [51, 70],
      text: `– Visions reveal important information, or spiritual memories of the location.<br>– Magical creatures offer symbolic gifts or useful keywords.`
    },
    {
      range: [71, 90],
      text: `– Spiritual presences demonstrate respect, admiration or spontaneous protection.<br>– May receive prophecies, clear guidance or feel the emotions of spirits around.`
    },
    {
      range: [91, 100],
      text: `– Events manifest intentionally for the character (cleansing rain, fire that shows the way, appearance of an ancestor).<br>– Profound revelations, rare blessings or unique pacts may occur.`
    }
  ],

  Place: [
    {
      range: [-100, -91],
      text: `NPCs are suspicious, aggressive, or hostile.<br>Shrines may reject or curse the character.`
    },
    {
      range: [-90, -71],
      text: `Negative rumors spread (even if false).<br>Yokai approach with dark or tempting intentions.`
    },
    {
      range: [-70, -51],
      text: `Guards keep a close eye, monks avoid contact.<br>Some people try to blackmail or bribe the character.`
    },
    {
      range: [-50, -31],
      text: `Social tests with disadvantage (or greater difficulty).`
    },
    {
      range: [-30, -11],
      text: `More expensive items, or vendors refuse service.`
    },
    {
      range: [-10, 0],
      text: `Unpredictable reactions: based on appearance, clan, or recent actions.<br>Some people are curious or indifferent.<br>Dialogue variation: balanced chance between help and distrust.`
    },
    {
      range: [1, 10],
      text: `Average prices. Dialogues require stronger arguments.<br>Normal social tests (no bonuses or penalties).<br>Spirit or Kami may ask for moral proof to interact.`
    },
    {
      range: [11, 30],
      text: `NPCs more open to dialogue and negotiation.<br>Fame precedes the character (positive rumors, stories of bravery or compassion).`
    },
    {
      range: [31, 50],
      text: `Discounted prices or access to rare items.<br>Neutral or benevolent yokai approach with curiosity or respect.`
    },
    {
      range: [51, 70],
      text: `Monks and priests offer help, guidance or healing.`
    },
    {
      range: [71, 90],
      text: `Guards and daimyo listen more attentively.<br>More ease in recruiting allies or mobilizing civilians.`
    },
    {
      range: [91, 100],
      text: `Unexpected help: a stranger remembers a past good deed.`
    }
  ],

  War: [
    {
      range: [-100, -91],
      text: `– -2 on all tests related to the event (dodge, perception, resistance, faith, etc.).<br>– Negative critical tests become catastrophic.<br>– Enemies target lethal regions.<br>– Events have extra complications (mud rain, poisoned arrows, collapsing terrain).<br>– Allies flee or die when trying to help.`
    },
    {
      range: [-90, -71],
      text: `– -1 on tests.<br>– Failed criticals have harsh consequences.<br>– Enemies try to immobilize or hinder group actions.<br>– Allies are shocked or hesitate.<br>– Duels are disadvantageous (solo, without support).`
    },
    {
      range: [-70, -51],
      text: `– -1 on tests, but it is possible to reverse with good narrative actions.<br>– Opponents attack with focus and cruelty.<br>– Negative events occur without extra chances to react.<br>– Civilians and messengers die or are used as distractions.`
    },
    {
      range: [-50, -31],
      text: `– No fixed modifier.<br>– Difficulty tests increase slightly (+1 DC).<br>– Events leave no time to think.<br>– Wounded people die without quick help.<br>– Opportunities arise too late.`
    },
    {
      range: [-30, -11],
      text: `– No fixed modifier.<br>– Allies still help, but are slow or disorganized.<br>– Reinforcements arrive, but not in ideal time.<br>– Duel occurs, but without moral consequences.`
    },
    {
      range: [-10, 0],
      text: `– No bonuses or penalties.<br>– Events follow standard descriptions.<br>– Interactions follow normal tests.<br>– Yokai or Kami remain unpredictable.`
    },
    {
      range: [1, 30],
      text: `– +1 to tests (dodge, resistance, perception, faith).<br>– Enemies narrowly miss fatal blows.<br>– Allies try to intervene to save or protect.<br>– Duels can attract respect even if lost.`
    },
    {
      range: [31, 60],
      text: `– +1 to tests<br>– Can repeat 1 test per event (1x/day)<br>– Arrows aim for the chest, but hit the shoulder.<br>– Reinforcements arrive at the critical moment.<br>– Civilians help to heal or protect.`
    },
    {
      range: [61, 90],
      text: `– +2 on relevant tests.<br>– Critical success gains bonus effects (healing, morale, aura).<br>– Enemies aim, but hesitate.<br>– Negative events become hidden opportunities.<br>– Kami intervene subtly (vision, whisper, aura).`
    },
    {
      range: [91, 100],
      text: `– +2 on tests + narrative advantage (choose outcome in some cases).<br>– Enemies miss vital blows by miracle.<br>– Allies sacrifice themselves to save the player.<br>– The Kami or local spirit clearly acts in your favor (healing, barrier, revelations).`
    },
  ]
};

function updateKarmaDescription(value) {
  const type = document.getElementById("karma_option").value;
  const descElement = document.getElementById("Description_d20_karma");

  const table = karmaEventDescriptions[type];
  if (!table || !descElement) return;

  const description = table.find(entry => value >= entry.range[0] && value <= entry.range[1]);

  descElement.innerHTML = description ? description.text : "Invalid karma value.";
}

document.addEventListener("DOMContentLoaded", function () {
  const inputKarma = document.getElementById("D20_karma");
  const selectKarma = document.getElementById("karma_option");

  inputKarma.addEventListener("input", function () {
    const value = parseInt(this.value);
    if (!isNaN(value)) {
      updateKarmaDescription(value);
    }
  });

  selectKarma.addEventListener("change", function () {
    const value = parseInt(inputKarma.value);
    if (!isNaN(value)) {
      updateKarmaDescription(value);
    }
  });

  updateKarmaDescription(parseInt(inputKarma.value));
});

// World - message
document.querySelector(".submit").addEventListener("click", () => {
  const messageBox = document.querySelector(".message");
  const screen = document.querySelector(".screen");
  const text = messageBox.value.trim();

  if (text !== "") {
    const p = document.createElement("p");
    p.innerHTML = text.replace(/\n/g, "<br>");
    screen.appendChild(p);
    screen.scrollTop = screen.scrollHeight;
    messageBox.value = "";
  }
});


// World - Upload de imagem
document.querySelector(".img_icon").addEventListener("click", () => {
  document.getElementById("imgInput").click();
});

document.getElementById("imgInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const screen = document.querySelector(".screen");
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "300px";
    img.style.display = "block";
    img.style.marginBottom = "10px";
    screen.appendChild(img);
    screen.scrollTop = screen.scrollHeight;
  };
  reader.readAsDataURL(file);
});


let currentTarget = null;

document.querySelector(".screen").addEventListener("contextmenu", function (e) {
  e.preventDefault();
  const target = e.target;

  if (target.tagName === "P" || target.tagName === "IMG") {
    currentTarget = target;

    const menu = document.getElementById("contextMenu");
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = "block";

    document.getElementById("editOption").style.display = target.tagName === "P" ? "block" : "none";
  }
});

document.addEventListener("click", () => {
  document.getElementById("contextMenu").style.display = "none";
});

document.getElementById("deleteOption").addEventListener("click", () => {
  if (currentTarget) {
    currentTarget.remove();
    document.getElementById("contextMenu").style.display = "none";
  }
});

document.getElementById("moveUpOption").addEventListener("click", () => {
  if (currentTarget && currentTarget.previousElementSibling) {
    const parent = currentTarget.parentNode;
    parent.insertBefore(currentTarget, currentTarget.previousElementSibling);
  }
  document.getElementById("contextMenu").style.display = "none";
});

document.getElementById("moveDownOption").addEventListener("click", () => {
  if (currentTarget && currentTarget.nextElementSibling) {
    const parent = currentTarget.parentNode;
    parent.insertBefore(currentTarget.nextElementSibling, currentTarget);
  }
  document.getElementById("contextMenu").style.display = "none";
});

document.getElementById("editOption").addEventListener("click", () => {
  if (currentTarget && currentTarget.tagName === "P") {
    const newText = prompt("Editar mensagem:", currentTarget.textContent);
    if (newText !== null) {
      currentTarget.textContent = newText;
    }
    document.getElementById("contextMenu").style.display = "none";
  }
});


//save_icon
const saveIcon = document.getElementById("save_icon");
const menu = document.getElementById("save_menu");

saveIcon.addEventListener("click", function (e) {
  const rect = saveIcon.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.bottom + window.scrollY}px`;
  menu.style.display = "block";
});

document.addEventListener("click", function (e) {
  if (!menu.contains(e.target) && e.target !== saveIcon) {
    menu.style.display = "none";
  }
});


//Page Dice
//Img dice
function animateResult(element) {
  element.classList.remove('result-flash');
  void element.offsetWidth;
  element.classList.add('result-flash');
}

document.querySelectorAll('.D').forEach(img => {
  img.addEventListener('click', () => {
    const dieType = img.alt;
    const resultId = `${dieType}_result`;
    const resultElement = document.getElementById(resultId);

    let maxValue = parseInt(dieType.replace('D', ''));
    let result;

    if (maxValue === 100) {
      result = 10 * Math.floor(Math.random() * 10 + 1);
    } else {
      result = Math.floor(Math.random() * maxValue) + 1;
    }

    if (resultElement) {
      resultElement.textContent = `Result: ${result}`;
      animateResult(resultElement);
    }
  });
});

//War Sistem
//Input D20 forced to be up to 20
function enforceMinMax(input) {
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  let value = parseInt(input.value);

  if (isNaN(value)) return;

  if (value > max) {
    input.value = max;
  } else if (value < min) {
    input.value = min;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    document.getElementById('moral'),
    document.getElementById('D20_war'),
    document.getElementById('D20_karma')
  ];

  inputs.forEach(input => {
    input.addEventListener('input', () => enforceMinMax(input));
  });
});

//War Sistem - Morale Button
function changemorals(delta) {
  const input = document.getElementById("moral");
  let current = parseInt(input.value) || 0;
  const min = parseInt(input.min);
  const max = parseInt(input.max);

  const newValue = Math.min(Math.max(current + delta, min), max);
  input.value = newValue;

  updateDescription(newValue);
}

//War Sistem - submit button (Events)
document.getElementById("B_D20_war").addEventListener("click", function () {
  const value = parseInt(document.getElementById("D20_war").value);
  if (!isNaN(value) && value >= 1 && value <= 20) {
    updateWarDescription(value);
  }
});

//War Sistem - R button
document.getElementById("random").addEventListener("click", function () {
  const randomValue = Math.floor(Math.random() * 20) + 1;
  document.getElementById("D20_war").value = randomValue;
  updateWarDescription(randomValue);
});

//War Sistem - Submit button (Karma)
document.getElementById("submit_karma").addEventListener("click", function () {
  const karma = parseInt(document.getElementById("D20_karma").value);
  const type = document.getElementById("karma_option").value;

  console.log("Karma:", karma);
  console.log("Event type:", type);
});


//Sheet buttons
// More Skill Button
document.querySelector(".more_skill").addEventListener("click", () => {
  const skillsList = document.querySelector(".skills");

  const newSkill = document.createElement("li");
  newSkill.setAttribute("contenteditable", "true");

  const newSpan = document.createElement("span");
  newSpan.classList.add("iten_name");
  newSpan.setAttribute("contenteditable", "true");
  newSkill.appendChild(newSpan);

  skillsList.appendChild(newSkill);

  skillsList.scrollTop = skillsList.scrollHeight;
});

// More Iten Button
document.querySelector(".more_iten").addEventListener("click", () => {
  const itenList = document.querySelector(".iten_list");

  const newIten = document.createElement("li");

  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("N2");
  input.value = 1;
  input.min = 0;

  const span = document.createElement("span");
  span.classList.add("iten_name");
  span.setAttribute("contenteditable", "true");
  span.textContent = "New Item";

  newIten.appendChild(input);
  newIten.appendChild(span);

  itenList.appendChild(newIten);

  itenList.scrollTop = itenList.scrollHeight;
});