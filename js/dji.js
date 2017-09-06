const domjudgeSite  = "get.php";
const scoreboardUrl = domjudgeSite + "?data=scoreboard";
const teamsUrl      = domjudgeSite + "?data=teams";
const problemsUrl   = domjudgeSite + "?data=problems";

function findUser(array, id) {
  for (var i = 0; i < array.length; i++) {
    if (array[i]["id"] == id){
      return array[i];
    }
  }
}

function score(user) {
  if(user["score"]["num_solved"] > 0){
    return user["score"]["num_solved"] / (user["score"]["total_time"] / 500000);
  }
  else {
    return 0;
  }
}

function advancedScore(user) {
  if(user["score"]["num_solved"] > 0){
    score = 0;
    attempts = 0;
    succeses = 0;
    for (var i = 0; i < user["problems"].length; i++) {
      if (user["problems"][i]["solved"]) {
        score += 1 / (user["problems"][i]["time"] / 500000);
        attempts += user["problems"][i]["num_judged"]
        succeses += 1;
      }
    }
    return [score, succeses, attempts];
  }
  else {
    return 0;
  }
}

$.get( scoreboardUrl, function( data ) {
  scoreboard = JSON.parse(data);
  $.get( problemsUrl, function ( data ) {
    problems = JSON.parse(data);
      $.get( teamsUrl, function( data ) {
        teams = JSON.parse(data);
        teams.sort(function(a, b) {
          return parseFloat(a.id) - parseFloat(b.id);
        });
        $('.table').html(
          "<table id=\"users\" style=\"width: 100%\" class=\"DomJudgeTable\">" +
          "<tr><th>#</th><th>User</th><th>Score</th><th>Accuracy</th><th>Completion</th></tr>" +
          "</table>"
        );
        for (var i = 0; i < scoreboard.length; i++) {
          user = findUser(teams, scoreboard[i]["team"]);
          if(scoreboard[i]["score"]["num_solved"] > 0) {
            advScore = advancedScore(scoreboard[i]);
            $('#users').append(
              "<tr>" +
              "<td class=\"rank\">" + (i + 1) + "." + "</td>" +
              "<td class=\"user\">" + user["name"] + "</td>" +
              "<td class=\"score\">" + Math.round(advScore[0]) + "</td>" +
              "<td class=\"accuracy\">" + Math.round((advScore[1] / advScore[2]) * 100) + "%</td>" +
              "<td class=\"user\">" + advScore[1] + "/" + problems.length + "</td>" +
              "</tr>"
            );
          }
        }
      });
  });
});
