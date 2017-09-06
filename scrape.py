from __future__ import division

import urllib2               # HTTP requests
import ssl                   # Needed to bypass SSL error
import BeautifulSoup as soup # HTML parser
import time                  # Needed to add last updated time stamp
import json                  # Needed to encode the output

pointInflation = 256000

# Ignore SSL error on the DomJudge website

cert                = ssl.create_default_context()
cert.check_hostname = False
cert.verify_mode    = ssl.CERT_NONE

domjudge = "http://localhost/Scoreboard.html" #"https://domjudge.es.aau.dk/public/"
html     = soup.BeautifulSoup(urllib2.urlopen(domjudge, context=cert).read())

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
        "points" : int(problem.find("span").text.replace("[","").replace(" point]","").replace(" points]",""))
    })
output["problems"] = problems

tableBody = table.find("tbody")
rows      = tableBody.findAll("tr")

for row in rows:

    ID = row["id"].replace("team:", "")

    columns  = row.findAll("td")
    answers = []
    score = 0
    completed = 0
    attempts = 0
    i = 0

    for problem in columns[5:]: # For every problem, [5:] because the problems start at column 6

        answer = {
            "id" : i,
            "tries" : problem.text,
            "time" : 0,
            "first" : False,
            "state" : problem["class"].replace("score_", "")
        }

        if answer["state"] == "correct":
            answer["tries"] = str(problem.text).split("/")[0]
            answer["time"] = int(str(problem.text).split("/")[1])
            score += (problems[answer["id"]]["points"] / (answer["time"] / pointInflation))
            completed += 1

        elif answer["state"] == "correct first":
            answer["tries"] = str(problem.text).split("/")[0]
            answer["time"] = int(str(problem.text).split("/")[1])
            answer["state"] = answer["state"].replace(" first", "")
            answer["first"] = True
            score += (problems[answer["id"]]["points"] / (answer["time"] / pointInflation))
            completed += 1

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



# Output file

outputFileLocation = "cache.json"
outputFile         = open(outputFileLocation, "w")
outputFile.write(json.dumps(output))
outputFile.close()
