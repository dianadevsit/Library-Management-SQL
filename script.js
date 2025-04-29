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

//Book SQL tips
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


// --- Hints for wrong answers ---
const chalkbyteHints = [ "Check your SELECT and FROM again carefully!", "Maybe the table name or column name is spelled wrong?", "Use a semicolon at the end of your statement!" ];
const bookHints = [ "We’re almost there! Try again!", "You're doing great! Let's fix the syntax!", "Check if you missed something simple!" ];

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

//Handles wrong answers and provides hints
function handleWrongAnswer(extraHint = "") {
  const chalkHint = chalkbyteHints[Math.floor(Math.random() * chalkbyteHints.length)];
  const bookHint = bookHints[Math.floor(Math.random() * bookHints.length)];
  document.getElementById('dialogue-text').innerHTML = 
    `<span style="color: green;">Professor Chalkbyte:</span> ${chalkHint}<br><br>` +
    `<span style="color: blue;">${bookName}:</span> ${bookHint}`;
  
  document.getElementById('hints-area').style.display = "block";

  if (extraHint) {
    document.getElementById('sql-output').innerText = extraHint;
  } else {
    document.getElementById('sql-output').innerText = "Try again!";
  }
}


// --- Static Missions 1-3 ---
const fixedMissions = [
  { prompt: `Mission 1: Select everything from Books.\nTry: SELECT * FROM Books;`, sql: "select * from books" },
  { prompt: `Mission 2: Select only the titles from Books.\nTry: SELECT title FROM Books;`, sql: "select title from books" },
  { prompt: `Mission 3: Select names from Authors.\nTry: SELECT name FROM Authors;`, sql: "select name from authors" }
];

// --- Random Missions 4-15 ---
const dynamicMissions = [
  { prompt: `Select all from Loans where id = 2\nTry: SELECT * FROM Loans WHERE id = 2;`, sql: "select * from loans where id = 2" },
  { prompt: `Select all from Books ordered by year_published ASC\nTry: SELECT * FROM Books ORDER BY year_published ASC;`, sql: "select * from books order by year_published asc" },
  { prompt: `Select all from Books ordered by year_published DESC\nTry: SELECT * FROM Books ORDER BY year_published DESC;`, sql: "select * from books order by year_published desc" },
  { prompt: `Select all from Authors where country = 'United Kingdom'\nTry: SELECT * FROM Authors WHERE country = 'United Kingdom';`, sql: "select * from authors where country = 'united kingdom'" },
  { prompt: `Select name from Borrowers\nTry: SELECT name FROM Borrowers;`, sql: "select name from borrowers" },
  { prompt: `Select title and year_published from Books\nTry: SELECT title, year_published FROM Books;`, sql: "select title, year_published from books" },
  { prompt: `Select all from Loans where borrower_id = 5\nTry: SELECT * FROM Loans WHERE borrower_id = 5;`, sql: "select * from loans where borrower_id = 5" },
  { prompt: `Select name and membership_date from Borrowers\nTry: SELECT name, membership_date FROM Borrowers;`, sql: "select name, membership_date from borrowers" },
  { prompt: `Select the country from Authors where name = 'Harper Lee'\nTry: SELECT country FROM Authors WHERE name = 'Harper Lee';`, sql: "select country from authors where name = 'harper lee'" },
  { prompt: `Select all from Borrowers ordered by membership_date DESC\nTry: SELECT * FROM Borrowers ORDER BY membership_date DESC;`, sql: "select * from borrowers order by membership_date desc" },
  { prompt: `Select loan_date from Loans\nTry: SELECT loan_date FROM Loans;`, sql: "select loan_date from loans" },
  { prompt: `Select return_date from Loans\nTry: SELECT return_date FROM Loans;`, sql: "select return_date from loans" }
];

// --- Game Setup ---
document.getElementById('save-book-name').addEventListener('click', function() {
  bookName = document.getElementById('book-name-input').value.trim() || "Script";
  updateDialogue(`Yay! I'll be known as ${bookName}! Now, what's your name?`);
  document.getElementById('book-name-input').style.display = "none";
  document.getElementById('save-book-name').style.display = "none";
  document.getElementById('player-name-box').style.display = "block";
});

document.getElementById('save-player-name').addEventListener('click', function() {
  playerName = document.getElementById('player-name-input').value.trim() || "Friend";
  document.getElementById('player-name-box').style.display = "none";
  document.getElementById('welcome-message').style.display = "block";
  document.getElementById('welcome-text').textContent = `Welcome, ${playerName}! I'm so excited to start teaching you SQL magic!`;
});

document.getElementById('start-lesson').addEventListener('click', function() {
  document.getElementById('book-character').classList.add('move-book-left');
  document.getElementById('welcome-message').style.display = "none";
  setTimeout(() => {
    document.getElementById('chalkboard').style.display = "block";
    updateDialogue(`Hello ${playerName}! I'm Professor Chalkbyte. Click on me anytime to view database tables! Click me now to begin!`);
  }, 800);
});

document.getElementById('chalkboard-img').addEventListener('click', function() {
  if (firstClickOnProfessor) {
    missionIndex = 0;
    currentLesson = 1;
    updateDialogue(fixedMissions[0].prompt);
    document.getElementById('sql-editor').style.display = "block";
    document.getElementById('table-popup').style.display = "none";
    firstClickOnProfessor = false;
  } else {
    showPopupTables();
  }
});

// --- Table Popup Handlers
document.getElementById('close-popup').addEventListener('click', hidePopupTables);

document.querySelectorAll('.table-button').forEach(button => {
  button.addEventListener('click', function() {
    const tableName = this.getAttribute('data-table');
    const formattedTableName = tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase(); // Capitalize first letter
    if (tables[formattedTableName]) {
      const { columns, data } = tables[formattedTableName];
      displayTable(columns, data, "table-columns-output"); // Move this inside
    }});
});

// --- Mini Book Logic ---
const miniBooks = [
  { title: "WHERE", content: "Use WHERE to filter rows in your query. Example: SELECT * FROM Loans WHERE borrower_id = 5;" },
  { title: "ORDER BY", content: "ORDER BY sorts results by a column. Use ASC for ascending, DESC for descending." },
  { title: "ASC", content: "ASC means ascending. It sorts from smallest to largest (e.g., A-Z, 1-10)." },
  { title: "DESC", content: "DESC means descending. It sorts from largest to smallest (e.g., Z-A, 10-1)." }
];

function revealMiniBooksOneAtATime() {
  const container = document.getElementById("mini-book-buttons");
  container.innerHTML = ""; // reset just in case
  let i = 0;

  function showNextBook() {
    if (i >= miniBooks.length) return;

    const btn = document.createElement("button");
    btn.textContent = miniBooks[i].title;
    btn.onclick = () => {
      document.getElementById("mini-book-info").innerText = miniBooks[i].content;
    };
    container.appendChild(btn);
    i++;
    setTimeout(showNextBook, 1000);
  }

  showNextBook();
}



// --- SQL RUN Handler
document.getElementById('run-sql').addEventListener('click', function() {
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
      // Show results for static missions
    if (currentLesson === 1) {
    displayTable(tables.Books.columns, tables.Books.data);
    } else if (currentLesson === 2) {
   displayTable(["title"], tables.Books.data.map(row => [row[1]]));
    } else if (currentLesson === 3) {
    displayTable(["name"], tables.Authors.data.map(row => [row[1]]));
    }
    if (currentLesson === 3) {
      missionQueue = dynamicMissions.sort(() => Math.random() - 0.5);
      missionIndex = 0;
      currentLesson++;
      updateDialogue(missionQueue[0].prompt);
      revealMiniBooksOneAtATime(); // ✅ THIS should be here
    }    
     else {
        currentLesson++;
        updateDialogue(fixedMissions[currentLesson - 1].prompt);
      }
    } else {
      handleWrongAnswer(`Hint: Try exactly ➔ ${currentFixed.sql.toUpperCase()};`);
    }
  } else if (currentLesson >= 4) {
    const currentDynamic = missionQueue[missionIndex];
    if (userSQL === currentDynamic.sql) {
      document.getElementById('sql-input').value = "";
      // Show a basic table based on the query keywords
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
        // --- Mini Book Hints ---
const miniBooks = [
  { title: "WHERE", content: "Use WHERE to filter your data. Example: SELECT * FROM Loans WHERE borrower_id = 5;" },
  { title: "ORDER BY", content: "ORDER BY helps sort results. ASC means ascending, DESC means descending." },
  { title: "ASC", content: "ASC is used to sort values from smallest to largest (or A to Z)." },
  { title: "DESC", content: "DESC is used to sort values from largest to smallest (or Z to A)." }
];

function revealMiniBooksOneAtATime() {
  const container = document.getElementById("mini-book-buttons");
  if (!container) return;

  let i = 0;
  function showNextBook() {
    if (i >= miniBooks.length) return;

    const btn = document.createElement("button");
    btn.textContent = miniBooks[i].title;
    btn.classList.add("mini-book-btn");
    btn.onclick = () => {
      document.getElementById("mini-book-info").innerText = miniBooks[i].content;
    };
    container.appendChild(btn);
    i++;
    setTimeout(showNextBook, 1200);
  }

  showNextBook();
}
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

// --- Restart Button
function showRestartButton() {
  const restartButton = document.createElement('button');
  restartButton.innerText = "Restart Game";
  restartButton.id = "restart-btn";
  restartButton.style.marginTop = "20px";
  restartButton.style.padding = "10px 20px";
  restartButton.style.backgroundColor = "#d4b483";
  restartButton.style.border = "none";
  restartButton.style.borderRadius = "10px";
  restartButton.style.cursor = "pointer";
  restartButton.onclick = () => location.reload();
  document.getElementById('sql-editor').appendChild(restartButton);
}
