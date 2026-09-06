let tape = JSON.parse(localStorage.getItem("postTape")) || [
  0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
];

let savedHead = parseInt(localStorage.getItem("postHead"), 10);
let head = isNaN(savedHead) ? 5 : savedHead;

const defaultProgram = [
  { type: "?", comment: "", emp: 2, full: 5 },
  { type: "V", comment: "" },
  { type: "<-", comment: "" },
  { type: "?", comment: "", emp: 1, full: 1 },
  { type: "X", comment: "" },
  { type: "<-", comment: "" },
  { type: "?", comment: "", emp: 1, full: 1 },
];
let program = JSON.parse(localStorage.getItem("postProgram")) || defaultProgram;

const tapeContainer = document.querySelector(".tape");
const tapeHint = document.querySelector(".tape-panel .panel__hint");
const programHint = document.querySelector(".program-panel .panel__hint");

const headSVG = `
  <span class="head" aria-hidden="true">
    <svg viewBox="0 0 20 14" width="20" height="14">
      <path d="M10 14 0 0h20z" fill="currentColor" />
    </svg>
  </span>
`;

function renderTape() {
  tapeContainer.innerHTML = "";

  tape.forEach((cellValue, index) => {
    const li = document.createElement("li");
    li.classList.add("cell");

    li.dataset.index = index;

    if (index === head) {
      li.classList.add("cell--current");
    }

    const mark = cellValue === 1 ? "●" : "";

    li.innerHTML = `
      ${index === head ? headSVG : ""}
      <span class="cell__index">${index}</span>
      <span class="cell__value">${mark}</span>
    `;

    tapeContainer.appendChild(li);
  });

  tapeHint.textContent = `${tape.length} cells · head at cell ${head}`;

  localStorage.setItem("postTape", JSON.stringify(tape));
  localStorage.setItem("postHead", head);
}
renderTape();

function left() {
  if (head > 0) {
    head--;
  }
  renderTape();
}

function right() {
  if (head < tape.length) {
    head++;
  }
  renderTape();
}

function mark() {
  tape[head] = 1;
  renderTape();
}

function del() {
  tape[head] = 0;
  renderTape();
}

const btnAddLeft = document.querySelector(
  '.cell-add[aria-label="Add cell left"]',
);
const btnAddRight = document.querySelector(
  '.cell-add[aria-label="Add cell right"]',
);
const btnRamLeft = document.querySelector(
  '.cell-add[aria-label="Remove cell left"]',
);
const btnRamRight = document.querySelector(
  '.cell-add[aria-label="Remove cell right"]',
);
const btnStepLeft = document.querySelector(
  '.stepper[aria-label="Move head left"]',
);
const btnStepRight = document.querySelector(
  '.stepper[aria-label="Move head right"]',
);

btnAddLeft.addEventListener("click", function () {
  tape.unshift(0);
  head++;
  renderTape();
});

btnAddRight.addEventListener("click", function () {
  tape.push(0);
  renderTape();
});

btnRamLeft.addEventListener("click", function () {
  if (tape.length > 1) {
    tape.shift(0);
    if (head > 0) {
      head--;
    }
    renderTape();
  }
});

btnRamRight.addEventListener("click", function () {
  if (tape.length > 1) {
    tape.pop(0);
    if (head === tape.length) {
      head--;
    }
    renderTape();
  }
});

btnStepLeft.addEventListener("click", function () {
  if (head > 0) {
    head--;
    renderTape();
  }
});

btnStepRight.addEventListener("click", function () {
  if (head < tape.length - 1) {
    head++;
    renderTape();
  }
});

const programContainer = document.querySelector(".program");

function renderProgram() {
  programContainer.innerHTML = "";

  program.forEach((cmd, index) => {
    const li = document.createElement("li");
    li.classList.add("cmd");

    li.dataset.index = index;

    const cmdNum = String(index + 1).padStart(2, "0");

    const selectHTML = `
      <select class="field__control" data-field="type">
        <option value="V" ${cmd.type === "V" ? "selected" : ""}>Mark cell (V)</option>
        <option value="X" ${cmd.type === "X" ? "selected" : ""}>Erase mark (X)</option>
        <option value="->" ${cmd.type === "->" ? "selected" : ""}>Step right (→)</option>
        <option value="<-" ${cmd.type === "<-" ? "selected" : ""}>Step left (←)</option>
        <option value="?" ${cmd.type === "?" ? "selected" : ""}>Conditional jump (?)</option>
        <option value="!" ${cmd.type === "!" ? "selected" : ""}>Stop (!)</option>
      </select>
    `;

    let jumpHTML = "";
    if (cmd.type === "?") {
      const empVal = cmd.emp || 1;
      const fullVal = cmd.full || 1;

      jumpHTML = `
        <div class="cmd__jump">
          <label class="field field--jump">
            <span class="field__label">If empty → #</span>
            <input class="field__control field__control--num" type="number" min="1" value="${empVal}" data-field="emp" />
          </label>
          <label class="field field--jump">
            <span class="field__label">If marked → #</span>
            <input class="field__control field__control--num" type="number" min="1" value="${fullVal}" data-field="full" />
          </label>
        </div>
      `;
    }

    li.innerHTML = `
      <span class="cmd__index">${cmdNum}</span>
  
      <div class="cmd__body">
        <div class="cmd__row">
          <label class="field">
            <span class="field__label">Command</span>
            ${selectHTML}
          </label>

          <label class="field field--comment">
            <span class="field__label">Comment</span>
            <input class="field__control" type="text" placeholder="e.g., initialization" value="${cmd.comment || ""}" data-field="comment" />
          </label>

          <button class="cmd__remove" type="button" aria-label="Delete command ${cmdNum}">
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
           </svg>
         </button>
        </div>
    
        ${jumpHTML}
      </div>
    `;

    programContainer.appendChild(li);
  });

  programHint.textContent = `${program.length} commands`;

  localStorage.setItem("postProgram", JSON.stringify(program));
}
renderProgram();

const btnAddComm = document.querySelector(".add-cmd");

btnAddComm.addEventListener("click", function () {
  program.push({ type: "V", comment: "" });
  renderProgram();
});

tapeContainer.addEventListener("click", function (event) {
  const clickedCell = event.target.closest(".cell");

  if (!clickedCell) return;

  const index = parseInt(clickedCell.dataset.index, 10);

  if (tape[index] === 0) {
    tape[index] = 1;
  } else {
    tape[index] = 0;
  }

  renderTape();
});

programContainer.addEventListener("change", function (event) {
  const target = event.target;

  const field = target.dataset.field;
  if (!field) return;

  const cmdElement = target.closest(".cmd");
  const index = parseInt(cmdElement.dataset.index, 10);

  if (field === "emp" || field === "full") {
    program[index][field] = parseInt(target.value, 10) || 1;
  } else {
    program[index][field] = target.value;
  }

  if (field === "type") {
    renderProgram();
  }

  localStorage.setItem("postProgram", JSON.stringify(program));
});

programContainer.addEventListener("click", function (event) {
  const removeBtn = event.target.closest(".cmd__remove");

  if (!removeBtn) return;

  const cmdElement = removeBtn.closest(".cmd");
  const index = parseInt(cmdElement.dataset.index, 10);

  program.splice(index, 1);

  renderProgram();
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let currentLine = 0;
let isRunning = false;

const btnRun = document.querySelector(".btn--run");
const btnPause = document.querySelector(".btn--pause");
const btnStop = document.querySelector(".btn--stop");
const statusLamp = document.querySelector(".lamp");
const statusText = document.querySelector(".deck__status-text");

function updateStatusUI(isWorking) {
  if (isWorking) {
    statusLamp.style.backgroundColor = "#4fae7f";
    statusText.textContent = "Running";
  } else {
    statusLamp.style.backgroundColor = "var(--light)";
    statusText.textContent = "Stopped";
  }
}

btnRun.addEventListener("click", async function () {
  if (isRunning) return;

  isRunning = true;
  updateStatusUI(true);

  while (isRunning && currentLine >= 0 && currentLine < program.length) {
    let nextLine = currentLine + 1;

    switch (program[currentLine].type) {
      case "V":
        mark();
        break;
      case "X":
        del();
        break;
      case "->":
        right();
        break;
      case "<-":
        left();
        break;
      case "?":
        if (tape[head] === 1) {
          nextLine = program[currentLine].full - 1;
        } else {
          nextLine = program[currentLine].emp - 1;
        }
        break;
      case "!":
        nextLine = program.length;
        break;
    }

    renderTape();

    const speedValue = document.querySelector(
      'input[name="speed"]:checked',
    ).value;
    currentLine = nextLine;
    let delay = 0;

    if (speedValue !== "instant") {
      delay = parseFloat(speedValue) * 1000;
    }

    await sleep(delay);
  }

  if (currentLine >= program.length) {
    isRunning = false;
    currentLine = 0;
    updateStatusUI(false);
  }
});

btnPause.addEventListener("click", function () {
  isRunning = false;
  updateStatusUI(false);
});

btnStop.addEventListener("click", function () {
  isRunning = false;
  currentLine = 0;
  updateStatusUI(false);
});
