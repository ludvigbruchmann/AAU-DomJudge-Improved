import urllib2               # HTTP requests
import ssl                   # Needed to bypass SSL error
import BeautifulSoup as soup # HTML parser
import time                  # Needed to add last updated time stamp
import json                  # Needed to encode the output

# Ignore SSL error on the DomJudge website

cert                = ssl.create_default_context()
cert.check_hostname = False
cert.verify_mode    = ssl.CERT_NONE

domjudge = "https://domjudge.es.aau.dk/public/"
html     = soup.BeautifulSoup(urllib2.urlopen(domjudge, context=cert).read())

output   = {                      # JSON data generated from table
    "last_updated" : time.time(),
    "users" : []                  # Empty, users are added later
}

table     = html.find("table", { "class" : "scoreboard" })
tableBody = table.find("tbody")
rows      = tableBody.findAll("tr")

for row in rows:

    ID = row["id"].replace("team:", "")

    columns  = row.findAll("td")
    answers = []
    i = 0

    for problem in columns[5:]: # For every problem, [5:] because the problems start at column 6

        answer = {
            "id" : i,
            "score" : problem.text,
            "time" : 0,
            "first" : False,
            "state" : problem["class"].replace("score_", "")
        }

        if answer["state"] == "correct":
            answer["score"] = str(problem.text).split("/")[0]
            answer["time"] = str(problem.text).split("/")[1]

        if answer["state"] == "correct first":
            answer["score"] = str(problem.text).split("/")[0]
            answer["time"] = str(problem.text).split("/")[1]
            answer["state"] = answer["state"].replace(" first", "")
            answer["first"] = True

        answers.append(answer)
        i += 1

    university = columns[2].find("span").text
    name = columns[2].text.replace(university, "")

    output["users"].append({
        "id" : ID,
        "name" : name,
        "problems" : answers
    })


# Output file

outputFileLocation = "cache.json"
outputFile         = open(outputFileLocation, "w")
outputFile.write(json.dumps(output))
outputFile.close()
