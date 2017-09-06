const cache  = "cache.json";

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

$.get( cache, function( data ) {
  json = data;
  $('.table').html(
    "<table id=\"users\" style=\"width: 100%\" class=\"DomJudgeTable\">" +
    "<tr><th>#</th><th>User</th><th>Score</th><th>Accuracy</th><th>Completion</th></tr>" +
    "</table>"
  );
  for (var i = 0; i < json["users"].length; i++) {
    if(json["users"][i]["completed"] > 0) {
      $('#users').append(
        "<tr>" +
        "<td class=\"rank\">" + (i + 1) + "." + "</td>" +
        "<td class=\"user\">" + json["users"][i]["name"] + "</td>" +
        "<td class=\"user\">" + Math.round(json["users"][i]["score"]) + "</td>" +
        "<td class=\"user\">" + Math.round((json["users"][i]["accuracy"] * 100)) + "%</td>" +
        "<td class=\"user\">" + json["users"][i]["completed"] + "/" + json["problems"].length + "</td>" +
        "</tr>"
      );
    }
  }
});
