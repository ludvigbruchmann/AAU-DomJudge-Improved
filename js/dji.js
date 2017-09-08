const cache  = "/cgi-bin/scrape.py";

function toggleProblems(user) {
  if($('.toggle-' + user).hasClass('hidden')) {
    $('.toggle-' + user).removeClass('hidden');
  } else {
    $('.toggle-' + user).addClass('hidden');
  }
}

sortedby = 0;

function bubbleSort(list, sortby) {

  temp = 0;

  if (sortedby != sortby) {
    sortedby = sortby;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list.length; j++) {
        if (j > 0) {
          if (list[j - 1][sortby] > list[j][sortby]) {
            temp = list[j - 1];
            list[j - 1] = list[j];
            list[j] = temp;
          }
        }
      }
    }
  }

  return list.reverse();
}

/* Joe's bubble sort
    public int[] bubblesort(int[] a)
    {
        int n = a.length;
        int temp;

        for(int i = 0; i < n; i++)  {
            for(int j = 1; j < (n - i); j++)    {
                if(a[j - 1] > a[j]) {
                    temp = a[j - 1]; //swap
                    a[j - 1] = a[j];
                    a[j] = temp;
                }
            }
        }
        return a;
    }
*/

function populate(json) {
  $('.table').html(
    "<table id=\"users\" style=\"width: 100%\" class=\"DomJudgeTable\">" +
    "<tr><th>#</th><th>User</th><th class=\"sortable sort-score\" onclick=\"sortBy(jsondata, 'users', 'score');\">Score</th><th class=\"sortable sort-accuracy\" onclick=\"sortBy(jsondata, 'users', 'accuracy');\">Accuracy</th><th class=\"sortable sort-completed\" onclick=\"sortBy(jsondata, 'users', 'completed');\">Completion</th></tr>" +
    "</table>"
  );
  x = 0;
  for (var i = 0; i < json["users"].length; i++) {
    if(json["users"][i]["completed"] > 0) {
      $('#users').append(
        "<tr id=\"user-" + (x + 1) + "\" class=\"user rank-" + (x + 1) + "\" onclick=\"toggleProblems(" + (x + 1) + ")\">" +
        "<td class=\"rank\">" + (x + 1) + "." + "</td>" +
        "<td class=\"user\">" + json["users"][i]["name"] + "</td>" +
        "<td class=\"user\">" + Math.round(json["users"][i]["score"]) + "</td>" +
        "<td class=\"user\">" + Math.round((json["users"][i]["accuracy"] * 100)) + "%</td>" +
        "<td class=\"user\">" + json["users"][i]["completed"] + "/" + json["problems"].length + "</td>" +
        "</tr>" +
        "<tr id=\"user-" + (x + 1) + "\" class=\"problem toggle toggle-" + (x + 1) + " hidden\">" +
        "<th class=\"rank\"></th>" +
        "<th>Problem</th>" +
        "<th>Score</th>" +
        "<th>Attempts</th>" +
        "<th>Average score</th>" +
        "</tr>"
      );
      for (var j = 0; j < json["users"][i]["problems"].length; j++) {
        if (json["users"][i]["problems"][j]["state"] == "correct") {
          if (json["users"][i]["problems"][j]["first"]) {
            firstState = "<i class=\"ion-android-star\" title=\"First user to solve this problem\"></i>";
          } else {
            firstState = "";
          }
          $('#users').append(
            "<tr id=\"problem-" + (j + 1) + "\" class=\"toggle toggle-" + (x + 1) + " hidden problem problem-" + (j + 1) + " " + json["users"][i]["problems"][j]["state"] + "\">" +
            "<td class=\"rank\">" + firstState + "</td>" +
            "<td class=\"name\">" + json["problems"][j]["name"].replace("w1-p", "Problem ") + "</td>" +
            "<td class=\"score\">" + Math.round(json["users"][i]["problems"][j]["points"]) + "</td>" +
            "<td class=\"tries\">" + json["users"][i]["problems"][j]["tries"] + "</td>" +
            "<td class=\"avgScore\">" + json["problems"][j]["avg_points"] + "</td>" +
            "</tr>"
          );
        }
      }
      x += 1;
    }
  }
}

function sortBy(json, subsection, sortby) {
  json[subsection] = bubbleSort(json[subsection], sortby);
  populate(json);
}

$.get( cache, function( data ) {
  jsondata = JSON.parse(data);
  jsondata["users"] = bubbleSort(jsondata["users"], "score");
  populate(jsondata);
});
