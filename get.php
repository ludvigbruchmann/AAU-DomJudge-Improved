<?php
  $domjudgeSite  = "https://domjudge.es.aau.dk/";
  $scoreboardUrl = $domjudgeSite . "api/scoreboard?cid=17";
  $teamsUrl      = $domjudgeSite . "api/teams";

  if($_REQUEST["data"] == "scoreboard"){
    echo file_get_contents($scoreboardUrl);
  } else if ($_REQUEST["data"] == "teams") {
    echo file_get_contents($teamsUrl);
  }
?>
