const cache  = "scrape.json";

function toggleProblems(user) {
  if($('.toggle-' + user).hasClass('hidden')) {
    $('.toggle-' + user).removeClass('hidden');
  } else {
    $('.toggle-' + user).addClass('hidden');
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
        "<tr id=\"user-" + (i + 1) + "\" class=\"user rank-" + (i + 1) + "\" onclick=\"toggleProblems(" + (i + 1) + ")\">" +
        "<td class=\"rank\">" + (i + 1) + "." + "</td>" +
        "<td class=\"user\">" + json["users"][i]["name"] + "</td>" +
        "<td class=\"user\">" + Math.round(json["users"][i]["score"]) + "</td>" +
        "<td class=\"user\">" + Math.round((json["users"][i]["accuracy"] * 100)) + "%</td>" +
        "<td class=\"user\">" + json["users"][i]["completed"] + "/" + json["problems"].length + "</td>" +
        "</tr>" +
        "<tr id=\"user-" + (i + 1) + "\" class=\"problem toggle toggle-" + (i + 1) + " hidden\">" +
        "<th class=\"rank\"></th>" +
        "<th>Problem</th>" +
        "<th>Score</th>" +
        "<th>Attempts</th>" +
        "<th>Average score</th>" +
        "</tr>"
      );
      for (var j = 0; j < json["users"][i]["problems"].length; j++) {
        if (json["users"][i]["problems"][j]["state"] == "correct") {
          $('#users').append(
            "<tr id=\"problem-" + (j + 1) + "\" class=\"toggle toggle-" + (i + 1) + " hidden problem problem-" + (j + 1) + " " + json["users"][i]["problems"][j]["state"] + "\">" +
            "<td class=\"rank\">" + "</td>" +
            "<td class=\"\">" + json["problems"][j]["name"] + "</td>" +
            "<td class=\"\">" + Math.round(json["users"][i]["problems"][j]["points"]) + "</td>" +
            "<td class=\"\">" + json["users"][i]["problems"][j]["tries"] + "</td>" +
            "<td class=\"\">" + json["problems"][j]["avg_points"] + "</td>" +
            "</tr>"
          );
        }
      }
    }
  }
});
