<?php
  $domjudgeSite  = "https://domjudge.es.aau.dk/";
  $scoreboardUrl = $domjudgeSite . "api/scoreboard?cid=17";
  $teamsUrl      = $domjudgeSite . "api/teams";
  $problemsUrl   = $domjudgeSite . "api/problems?cid=17";

  if($_REQUEST["data"] == "scoreboard"){
    echo file_get_contents($scoreboardUrl);
  } else if ($_REQUEST["data"] == "teams") {
    echo file_get_contents($teamsUrl);
  } else if ($_REQUEST["data"] == "problems") {
    echo file_get_contents($problemsUrl);
  }
?>
