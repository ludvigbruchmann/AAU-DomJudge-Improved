#!/usr/bin/python

from __future__ import division

import sys
sys.path.append("BeautifulSoup.pyc")

import urllib2               # HTTP requests
import BeautifulSoup as soup # HTML parser
import time                  # Needed to add last updated time stamp
import json                  # Needed to encode the output

print "Content-type: text/html\n\n"

pointInflation = 1000     # Use this to adjust for time based Scoreboard
cacheFile  = "cache.json" # Where the scraped JSON data is written

# Check when cache was last updated

checkCache   = open(cacheFile, "r")
last_updated = json.loads(checkCache.read())["last_updated"]
checkCache.close()


if time.time() - last_updated > 60:

    domjudge = "https://domjudge.es.aau.dk/public/"
    html     = soup.BeautifulSoup(urllib2.urlopen(domjudge).read())

    output   = {                      # JSON data generated from table
        "last_updated" : time.time(),
        "users" : [],                 # Empty, users are added later
        "problems" : []               # Empty, problems are added later
    }

    table        = html.find("table", { "class" : "scoreboard" })
    tableHeaders = table.findAll("th")
    problems     = []

    for problem in tableHeaders[3:]:
        problems.append({
            "name" : problem.find("a").text,
            "points" : int(problem.find("span").text.replace("[","").replace(" point]","").replace(" points]","")),
            "completed" : 0, # Users who completed this problem
            "avg_points" : 0,
            "min_time" : 0
        })

    output["problems"] = problems

    tableBody = table.find("tbody")
    rows      = tableBody.findAll("tr")

    for row in rows:

        columns  = row.findAll("td")
        i = 0

        for problem in columns[5:]:

            try:
                if int(str(problem.text).split("/")[1]) < problems[i]["min_time"]:
                    problems[i]["min_time"] = int(str(problem.text).split("/")[1])
                elif problems[i]["min_time"] == 0:
                    problems[i]["min_time"] = int(str(problem.text).split("/")[1])
            except Exception as e: pass
            i += 1

    for row in rows:

        ID = row["id"].replace("team:", "")

        columns  = row.findAll("td")
        answers = []
        score = 0
        completed = 0
        attempts = 0
        i = 0

        # TODO: The time of a problem is based on when the class was created, not when the problem was created, fix this somehow, maybe add min time to solve on the problems

        for problem in columns[5:]: # For every problem, [5:] because the problems start at column 6

            answer = {
                "id" : i,
                "tries" : problem.text,
                "time" : 0,
                "points" : 0,
                "first" : False,
                "state" : problem["class"].replace("score_", "")
            }

            if answer["state"] == "correct" or answer["state"] == "correct first":
                answer["tries"] = str(problem.text).split("/")[0]
                answer["time"] = int(str(problem.text).split("/")[1])
                timeToAnswer = int(answer["time"] - problems[i]["min_time"]) + 500
                if timeToAnswer > 2880:
                    timeToAnswer = 2880
                timeToAnswer /= 500
                points = int(problems[answer["id"]]["points"] / (timeToAnswer / pointInflation))
                answer["points"] = points
                score += answer["points"]
                completed += 1
                problems[answer["id"]]["completed"] += 1

            if answer["state"] == "correct first":
                answer["state"] = answer["state"].replace(" first", "")
                answer["first"] = True

            answer["tries"] = int(answer["tries"])

            attempts += answer["tries"]

            answers.append(answer)
            i += 1

        university = columns[2].find("span").text
        name = columns[2].text.replace(university, "")

        if attempts > 0:
            namethislater = completed / attempts
        else:
            namethislater = 0

        output["users"].append({
            "id" : ID,
            "name" : name,
            "problems" : answers,
            "score" : score,
            "accuracy" : namethislater,
            "completed" : completed
        })

    i = 0
    for problem in output["problems"]:
        problemScores = []
        for user in output["users"]:
            if user["problems"][i]["state"] == "correct":
                problemScores.append(user["problems"][i]["points"])
        problem["avg_points"] = int(sum(problemScores) / len(problemScores))
        i += 1

    # Output file

    outputFile = open(cacheFile, "w")
    outputFile.write(json.dumps(output))
    outputFile.close()

returnFile = open(cacheFile, "r")
print returnFile.read()
returnFile.close()
