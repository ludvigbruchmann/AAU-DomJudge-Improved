const cache  = "/cgi-bin/scrape.py";

function createChart(canvas, type, title, labels, data) {
  $("#" + canvas).removeClass("hidden");
  var ctx = document.getElementById(canvas + "-canvas").getContext('2d');
  var myChart = new Chart(ctx, {
      type: type,
      data: {
          labels: labels,
          datasets: [{
              label: title,
              data: data,
              backgroundColor: "rgba(97, 232, 137, .33)",
              borderColor: "rgba(97, 232, 137, 1)",
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

sortedby = 0;

function toggleProblems(user) {
  if($('.toggle-' + user).hasClass('hidden')) {
    $('.toggle-' + user).removeClass('hidden');
  } else {
    $('.toggle-' + user).addClass('hidden');
  }
}

function formatNumber(n) {
  var rx=  /(\d+)(\d{3})/;
  return String(n).replace(/^\d+/, function(w){
      while(rx.test(w)){
          w= w.replace(rx, '$1.$2');
      }
      return w;
  });
}

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
  var last_updated = new Date(jsondata["last_updated"] * 1000);
  $('.table').html(
    "<table id=\"users\" style=\"width: 100%\" class=\"DomJudgeTable\">" +
    "<tr><th></th><th>User</th><th class=\"sortable sort-score\" onclick=\"sortBy(jsondata, 'users', 'score');\">Score</th><th class=\"sortable sort-accuracy\" onclick=\"sortBy(jsondata, 'users', 'accuracy');\">Accuracy</th><th class=\"sortable sort-completed\" onclick=\"sortBy(jsondata, 'users', 'completed');\">Completion</th></tr>" +
    "</table>"
  );
  x = 0;
  for (var i = 0; i < json["users"].length; i++) {
    if(json["users"][i]["completed"] > 0) {
      $('#users').append(
        "<tr id=\"user-" + (x + 1) + "\" class=\"user rank-" + (x + 1) + "\" onclick=\"toggleProblems(" + (x + 1) + ")\">" +
        "<td class=\"rank\">" + (x + 1) + "." + "</td>" +
        "<td class=\"user\">" + json["users"][i]["name"] + "</td>" +
        "<td class=\"user\">" + formatNumber(json["users"][i]["score"]) + "</td>" +
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
            "<td class=\"name\">" + json["problems"][j]["name"] + "</td>" +
            "<td class=\"score\">" + formatNumber(json["users"][i]["problems"][j]["points"]) + "</td>" +
            "<td class=\"tries\">" + json["users"][i]["problems"][j]["tries"] + "</td>" +
            "<td class=\"avgScore\">" + json["problems"][j]["avg_points"] + "</td>" +
            "</tr>"
          );
        }
      }
      x += 1;
    }
  }
  $(".table").append("<p class=\"center\"><b>Last updated:</b> " + last_updated.toLocaleDateString() + " " + last_updated.toLocaleTimeString() + "</p>");
}

function sortBy(json, subsection, sortby) {
  json[subsection] = bubbleSort(json[subsection], sortby);
  populate(json);
}

$.get( cache, function( data ) {
  jsondata = JSON.parse(data);
  jsondata["users"] = bubbleSort(jsondata["users"], "score");
  labels = [];
  numAnswered = [];
  for (var i = 0; i < jsondata["problems"].length; i++) {
    labels.push(jsondata["problems"][i]["name"]);
    numAnswered.push(jsondata["problems"][i]["completed"]);
  }
  createChart("problems-graph", "bar", "Users completed", labels, numAnswered)
  populate(jsondata);
});
