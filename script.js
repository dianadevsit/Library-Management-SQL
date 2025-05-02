// --- Setup Variables ---
let playerName = "";
let bookName = "";
let currentLesson = 0;
let firstClickOnProfessor = true;
let missionIndex = 0;
let missionQueue = []; // for random missions

// --- Tables ---
const tables = {
  Books: {
    columns: ["id", "title", "author_id", "year_published"],
    data: [
      [1, "The Hobbit", 1, 1937],
      [2, "Harry Potter and the Sorcerer's Stone", 2, 1997],
      [3, "To Kill a Mockingbird", 3, 1960],
      [4, "1984", 4, 1949],
      [5, "Pride and Prejudice", 5, 1813]
    ]
  },
  Authors: {
    columns: ["id", "name", "country"],
    data: [
      [1, "J.R.R. Tolkien", "United Kingdom"],
      [2, "J.K. Rowling", "United Kingdom"],
      [3, "Harper Lee", "United States"],
      [4, "George Orwell", "United Kingdom"],
      [5, "Jane Austen", "United Kingdom"]
    ]
  },
  Borrowers: {
    columns: ["id", "name", "membership_date"],
    data: [
      [1, "Alice Smith", "2020-06-15"],
      [2, "Bob Johnson", "2021-01-23"],
      [3, "Charlie Rose", "2019-11-02"],
      [4, "Diana Clarke", "2022-03-19"],
      [5, "Evan Turner", "2018-08-30"]
    ]
  },
  Loans: {
    columns: ["id", "book_id", "borrower_id", "loan_date", "return_date"],
    data: [
      [1, 2, 1, "2023-01-05", "2023-01-19"],
      [2, 4, 2, "2023-02-12", "2023-02-26"],
      [3, 1, 3, "2023-03-08", "2023-03-22"],
      [4, 3, 4, "2023-04-14", "2023-04-28"],
      [5, 5, 5, "2023-05-01", "2023-05-15"]
    ]
  }
};

// --- Book SQL tips ---
const sqlTips = [
  "Did you know? You can use WHERE to filter rows based on a condition!",
  "Tip: ORDER BY lets you sort your results alphabetically or numerically.",
  "Using SELECT column_name FROM table is great when you don’t need everything!",
  "Semicolons (;) signal the end of your SQL statement—don’t forget them!",
  "Need just one column? Try SELECT name FROM Authors!"
];

function randomBookTip() {
  const tip = sqlTips[Math.floor(Math.random() * sqlTips.length)];
  document.getElementById('dialogue-text').innerHTML += `<br><span style="color: blue;">${bookName}:</span> ${tip}`;
}

// --- Mini Book Logic ---
function revealMiniBooksOneAtATime() {
  const container = document.getElementById("mini-book-buttons");
  const infoBox = document.getElementById("mini-book-info");
  const miniArea = document.getElementById('mini-book-area');

  container.innerHTML = "";
  infoBox.innerText = "";
  miniArea.style.display = "block";

  let i = 0;
  function showNextBook() {
    if (i >= miniBooks.length) return;

    const btn = document.createElement("button");
    btn.textContent = miniBooks[i].title;
    btn.addEventListener("click", () => {
      infoBox.innerText = miniBooks[i].content;
    });

    container.appendChild(btn);
    i++;
    setTimeout(showNextBook, 1000);
  }

  showNextBook();
}

// --- Hints for wrong answers ---
const chalkbyteHints = [
  "Check your SELECT and FROM again carefully!",
  "Maybe the table name or column name is spelled wrong?",
  "Use a semicolon at the end of your statement!"
];
const bookHints = [
  "We’re almost there! Try again!",
  "You're doing great! Let's fix the syntax!",
  "Check if you missed something simple!"
];

// --- Helper Functions ---
function updateDialogue(text) {
  document.getElementById('dialogue-text').innerText = text;
}

function displayTable(columns, data, outputArea = "sql-output") {
  let html = `<table class="popup-table"><thead><tr>`;
  columns.forEach(col => html += `<th>${col}</th>`);
  html += `</tr></thead><tbody>`;
  data.forEach(row => {
    html += `<tr>`;
    row.forEach(cell => html += `<td>${cell}</td>`);
    html += `</tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById(outputArea).innerHTML = html;
}

function showMiniBook(topic) {
  const helpers = ["helper-where", "helper-orderby", "helper-asc", "helper-desc"];
  helpers.forEach(id => document.getElementById(id).style.display = "none");
  if (document.getElementById(topic)) {
    document.getElementById('sql-helpers').style.display = "block";
    document.getElementById(topic).style.display = "inline-block";
  }
}

function hideMiniBooks() {
  document.getElementById('sql-helpers').style.display = "none";
}

function hidePopupTables() {
  document.getElementById('table-popup').style.display = "none";
}

function showPopupTables() {
  document.getElementById('table-popup').style.display = "block";
}

// --- Handle Wrong Answers ---
function handleWrongAnswer(extraHint = "") {
  const chalkHint = chalkbyteHints[Math.floor(Math.random() * chalkbyteHints.length)];
  const bookHint = bookHints[Math.floor(Math.random() * bookHints.length)];
  document.getElementById('dialogue-text').innerHTML =
    `<span style="color: green;">Professor Chalkbyte:</span> ${chalkHint}<br><br>` +
    `<span style="color: blue;">${bookName}:</span> ${bookHint}`;
  document.getElementById('hints-area').style.display = "block";
  document.getElementById('sql-output').innerText = extraHint || "Try again!";
}

// --- Missions ---
const fixedMissions = [
  {
    "prompt": "Try typing 'SELECT * FROM Books' to see all the books.",
    "sql": "select * from books"
  },
  {
    "prompt": "Try to select only the titles from the Books table.",
    "sql": "select title from books"
  },
  {
    "prompt": "Try to select the names of all Authors.",
    "sql": "select name from authors"
  }
];

const dynamicMissions = [
  {
    "prompt": "Try to select all from the Loans table where id equals 2.",
    "sql": "select * from loans where id = 2"
  },
  {
    "prompt": "Try to select all from the Books table ordered by year_published in ascending order.",
    "sql": "select * from books order by year_published asc"
  },
  {
    "prompt": "Try to select all from the Books table ordered by year_published in descending order.",
    "sql": "select * from books order by year_published desc"
  },
  {
    "prompt": "Try to select all Authors that are from the United Kingdom.",
    "sql": "select * from authors where country = 'united kingdom'"
  },
  {
    "prompt": "Try to select the names of all Borrowers.",
    "sql": "select name from borrowers"
  },
  {
    "prompt": "Try to select the titles and year_published from the Books table.",
    "sql": "select title, year_published from books"
  },
  {
    "prompt": "Try to select all from the Loans table where borrower_id equals 5.",
    "sql": "select * from loans where borrower_id = 5"
  },
  {
    "prompt": "Try to select the name and membership_date from the Borrowers table.",
    "sql": "select name, membership_date from borrowers"
  },
  {
    "prompt": "Try to select the country from the Authors table where the name is 'Harper Lee'.",
    "sql": "select country from authors where name = 'harper lee'"
  },
  {
    "prompt": "Try to select all from the Borrowers table ordered by membership_date in descending order.",
    "sql": "select * from borrowers order by membership_date desc"
  },
  {
    "prompt": "Try to select the loan_date from the Loans table.",
    "sql": "select loan_date from loans"
  },
  {
    "prompt": "Try to select the return_date from the Loans table.",
    "sql": "select return_date from loans"
  }
];


const miniBooks = [
  {
    "title": "WHERE",
    "content": "Use WHERE to filter rows in your query. Example: SELECT * FROM Loans WHERE borrower_id = 5;"
  },
  {
    "title": "ORDER BY",
    "content": "ORDER BY sorts results by a column. Use ASC for ascending, DESC for descending."
  },
  {
    "title": "ASC",
    "content": "ASC means ascending. It sorts from smallest to largest (e.g., A-Z, 1-10)."
  },
  {
    "title": "DESC",
    "content": "DESC means descending. It sorts from largest to smallest (e.g., Z-A, 10-1)."
  }
];

// --- Game Setup ---
document.getElementById('save-book-name').addEventListener('click', function () {
  bookName = document.getElementById('book-name-input').value.trim() || "Script";
  updateDialogue(`Yay! I'll be known as ${bookName}! Now, what's your name?`);
  document.getElementById('book-name-input').style.display = "none";
  document.getElementById('save-book-name').style.display = "none";
  document.getElementById('player-name-box').style.display = "block";
});

document.getElementById('save-player-name').addEventListener('click', function () {
  playerName = document.getElementById('player-name-input').value.trim() || "Friend";
  document.getElementById('player-name-box').style.display = "none";
  document.getElementById('welcome-message').style.display = "block";
  document.getElementById('welcome-text').textContent = `Welcome, ${playerName}! I'm so excited to start teaching you SQL magic!`;
});

document.getElementById('start-lesson').addEventListener('click', function () {
  document.getElementById('book-character').classList.add('move-book-left');
  document.getElementById('welcome-message').style.display = "none";

  setTimeout(() => {
    document.getElementById('chalkboard').style.display = "block";
    updateDialogue(`Hello ${playerName}! I'm Professor Chalkbyte. Click on me anytime to view database tables! Click me now to begin!`);
  }, 800);
  document.getElementById('chalkboard-img').addEventListener('click', function () {
    const chalkboardVisible = document.getElementById('chalkboard').style.display !== "none";
    if (!chalkboardVisible) return;
  
    if (firstClickOnProfessor) {
      missionIndex = 0;
      currentLesson = 1;
      updateDialogue(fixedMissions[0].prompt);
      document.getElementById('sql-editor').style.display = "block";
      document.getElementById('table-popup').style.display = "none";
      document.getElementById('mini-book-area').style.display = "none";
      firstClickOnProfessor = false;
      randomBookTip();
    } else {
      showPopupTables();
    }
  });  
});
  

// --- Popup Buttons ---
document.getElementById('close-popup').addEventListener('click', hidePopupTables);
document.querySelectorAll('.table-button').forEach(button => {
  button.addEventListener('click', function () {
    const tableName = this.getAttribute('data-table');
    const formattedTableName = tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase();
    if (tables[formattedTableName]) {
      const { columns, data } = tables[formattedTableName];
      displayTable(columns, data, "table-columns-output");
    }
  });
});

// --- SQL Run Handler ---
document.getElementById('run-sql').addEventListener('click', function () {
  const userSQL = document.getElementById('sql-input').value.trim().toLowerCase().replace(/;$/, "");
  document.getElementById('sql-output').innerHTML = "";
  document.getElementById('hints-area').style.display = "none";

  if (!userSQL) {
    document.getElementById('sql-output').innerText = "Please write some SQL!";
    return;
  }

  if (currentLesson >= 1 && currentLesson <= 3) {
    const currentFixed = fixedMissions[currentLesson - 1];
    if (userSQL === currentFixed.sql) {
      document.getElementById('sql-input').value = "";

      // Show output for static missions
      if (currentLesson === 1) {
        displayTable(tables.Books.columns, tables.Books.data);
      } else if (currentLesson === 2) {
        displayTable(["title"], tables.Books.data.map(row => [row[1]]));
      } else if (currentLesson === 3) {
        displayTable(["name"], tables.Authors.data.map(row => [row[1]]));
        missionQueue = dynamicMissions.sort(() => Math.random() - 0.5);
        missionIndex = 0;
        currentLesson++;
        updateDialogue(missionQueue[0].prompt);
        revealMiniBooksOneAtATime();
        return;
      }

      currentLesson++;
      if (currentLesson <= 3) {
        updateDialogue(fixedMissions[currentLesson - 1].prompt);
      }

    } else {
      handleWrongAnswer(`Hint: Try exactly ➔ ${currentFixed.sql.toUpperCase()};`);
    }

  } else if (currentLesson >= 4) {
    const currentDynamic = missionQueue[missionIndex];
    if (userSQL === currentDynamic.sql) {
      document.getElementById('sql-input').value = "";

      // Display correct table
      if (userSQL.includes("books")) {
        displayTable(tables.Books.columns, tables.Books.data);
      } else if (userSQL.includes("authors")) {
        displayTable(tables.Authors.columns, tables.Authors.data);
      } else if (userSQL.includes("borrowers")) {
        displayTable(tables.Borrowers.columns, tables.Borrowers.data);
      } else if (userSQL.includes("loans")) {
        displayTable(tables.Loans.columns, tables.Loans.data);
      }

      missionIndex++;
      if (missionIndex >= missionQueue.length) {
        updateDialogue(`🎉 Congratulations, ${playerName}! You finished all 15 SQL Missions!\nClick Restart to play again!`);
        document.getElementById('run-sql').disabled = true;
        showRestartButton();
      } else {
        updateDialogue(missionQueue[missionIndex].prompt);
      }

      if (currentDynamic.sql.includes("where")) {
        showMiniBook("helper-where");
      } else if (currentDynamic.sql.includes("order by")) {
        showMiniBook("helper-orderby");
      } else if (currentDynamic.sql.includes("asc")) {
        showMiniBook("helper-asc");
      } else if (currentDynamic.sql.includes("desc")) {
        showMiniBook("helper-desc");
      }

    } else {
      handleWrongAnswer(`Hint: Try exactly ➔ ${currentDynamic.sql.toUpperCase()};`);
    }
  }
});
