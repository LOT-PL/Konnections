(function() {
  var grid = document.getElementById('grid');
  var selectedTiles = [];
  var groupsFound = [];
  var puzzle = [];
  var messageScreen = document.getElementById('message-screen');
  var messageTitle = document.getElementById('message-title');
  var playAgainBtn = document.getElementById('play-again-btn');
  var maxWrongAttempts = 5;
  var wrongAttempts = 0;

  var allGroups = [
    { name: "Fruits", words: ['Apple','Pear','Plum','Kiwi'] },
    { name: "Animals", words: ['Cat','Dog','Wolf','Bear'] },
    { name: "Colors", words: ['Red','Blue','Green','Cyan'] },
    { name: "Vehicles", words: ['Car','Bus','Train','Bike'] },
    { name: "Airlines", words: ['Delta','LOT','United','Qatar'] },
    { name: "Countries", words: ['Brazil','Japan','USA','Poland'] },
    { name: "Trains", words: ['DB','PKP','SNCF','EMR'] },
    { name: "Cities", words: ['Paris','Rome','Oslo','Lyon'] },
    { name: "Sports", words: ['Soccer','Tennis','Golf','Ski'] },
    { name: "Foods", words: ['Pizza','Burger','Pasta','Sushi'] },
    { name: "Programming Languages", words: ['Go','JS','C','HTML'] }
  ];

  function generatePuzzle() {
    puzzle = [];
    groupsFound = [];
    wrongAttempts = 0;

    var selectedGroups = [];
    while (selectedGroups.length < 4) {
      var idx = Math.floor(Math.random() * allGroups.length);
      if (selectedGroups.indexOf(idx) === -1) selectedGroups.push(idx);
    }

    selectedGroups.forEach(function(idx) {
      puzzle = puzzle.concat(allGroups[idx].words);
      groupsFound.push(false);
    });

    puzzle.sort(function() { return 0.5 - Math.random(); });
  }

  function createGrid() {
    grid.innerHTML = '';
    puzzle.forEach(function(word, i) {
      var tile = document.createElement('div');
      tile.className = 'tile';
      tile.innerHTML = word;
      tile.dataset.index = i;
      tile.onclick = selectTile;
      grid.appendChild(tile);

      if ((i + 1) % 4 === 0 && i !== puzzle.length - 1) {
        grid.appendChild(document.createElement('br'));
      }
    });
  }

  function selectTile() {
    if (selectedTiles.indexOf(this) === -1) {
      selectedTiles.push(this);
      this.style.border = '2px solid #333';
      this.style.backgroundColor = '#aaa';
    } else {
      selectedTiles.splice(selectedTiles.indexOf(this), 1);
      this.style.border = '';
      this.style.backgroundColor = '#888';
    }

    if (selectedTiles.length === 4) validateGroup();
  }

  function validateGroup() {
    var group = selectedTiles.map(function(t){ return t.innerHTML; });
    var found = false;

    allGroups.forEach(function(g, i) {
      var matchCount = 0;
      group.forEach(function(word) {
        if (g.words.indexOf(word) !== -1) matchCount++;
      });

      if (matchCount === 4) {
        found = true;
        groupsFound[i] = true;

        selectedTiles.forEach(function(tile) {
          tile.style.backgroundColor = '#000';
          tile.style.color = '#fff';
          tile.onclick = null;
        });
      }
    });

    if (!found) {
      wrongAttempts++;
      selectedTiles.forEach(function(tile) {
        tile.style.backgroundColor = '#fff';
        tile.style.color = '#000';
        tile.style.border = '';
      });

      if (wrongAttempts >= maxWrongAttempts) showMessage('You Lost!');
    }

    selectedTiles = [];
    checkWin();
  }

  function checkWin() {
    if (groupsFound.filter(Boolean).length === 4) showMessage('You Win!');
  }

  function shufflePuzzle() {
    puzzle.sort(function() { return 0.5 - Math.random(); });
    createGrid();
  }

  function newPuzzle() {
    hideMessage();
    generatePuzzle();
    createGrid();
  }

  function showMessage(text) {
    messageTitle.innerHTML = text;
    messageScreen.className = '';
  }

  function hideMessage() {
    messageScreen.className = 'hidden';
  }

  playAgainBtn.onclick = newPuzzle;
  document.getElementById('shuffleBtn').onclick = shufflePuzzle;
  document.getElementById('newPuzzleBtn').onclick = newPuzzle;

  var statsScreen = document.getElementById('stats-screen');
  var statsTextEl = document.getElementById('stats-text');
  var closeStatsBtn = document.getElementById('close-stats-btn');

  document.getElementById('statsBtn').onclick = function() {
    statsTextEl.innerHTML = 
      'Groups found: ' + groupsFound.filter(Boolean).length +
      '/4<br>Wrong attempts: ' + wrongAttempts + '/' + maxWrongAttempts;
    statsScreen.className = '';
  };
  closeStatsBtn.onclick = function() { statsScreen.className = 'hidden'; };

  var creditsScreen = document.getElementById('credits-screen');
  var closeCreditsBtn = document.getElementById('close-credits-btn');
  document.getElementById('creditsBtn').onclick = function() { creditsScreen.className = ''; };
  closeCreditsBtn.onclick = function() { creditsScreen.className = 'hidden'; };

  generatePuzzle();
  createGrid();
})();
