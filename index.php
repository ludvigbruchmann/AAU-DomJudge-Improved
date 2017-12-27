<head>

  <meta charset="UTF-8" />
  <meta http-equiv="content-type" content="text/html;charset=utf-8" />

  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/motus.min.css">
  <link rel="stylesheet" href="css/style.min.css">

  <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.min.js"></script>

  <script src='js/dji.js'></script>

  <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" type="text/css">

  <link rel="icon" type="image/png" href="http://img.ludvig.xyz/favicon/favicon.ico">
  <link rel="apple-touch-icon" sizes="57x57" href="http://img.ludvig.xyz/favicon/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="http://img.ludvig.xyz/favicon/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="http://img.ludvig.xyz/favicon/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="http://img.ludvig.xyz/favicon/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="http://img.ludvig.xyz/favicon/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="http://img.ludvig.xyz/favicon/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="http://img.ludvig.xyz/favicon/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="http://img.ludvig.xyz/favicon/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="http://img.ludvig.xyz/favicon/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="http://img.ludvig.xyz/favicon/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="http://img.ludvig.xyz/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="http://img.ludvig.xyz/favicon/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="http://img.ludvig.xyz/favicon/favicon-16x16.png">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>DomJudge Improved - AAU</title>

</head>
<body>

  <div class="main">

    <div class="container">

      <div class="grid-6 offset-3">
        <img src="logo.svg" alt="DomJudge Improved" class="responsive-img center-img"/>
        <p class="justify">
          Only users who have solved at least 1 problem are shown. The full score algorithm can be found on <a href="https://github.com/ludvigbruchmann/AAU-DomJudge-Improved">GitHub</a>. It is based on the points given for each problem, and how long it took to solve the problem.
        </p>
        <p class="center"><b>TIP:</b> Click on a user to see their score on each problem.</p>
      </div>

      <div class="grid-12 mb hidden" id="problems-graph">
        <canvas id="problems-graph-canvas" width="800" height="320"></canvas>
      </div>

      <div class="grid-12 table">
        <img src="spinner.svg" class="spinner centerimg" alt="" />
      </div>

    </div>

  </div>

  <div class="footer">
    <p>Built with <a href="https://github.com/ludvigbruchmann/motus">Motus</a>, by <a href="http://ludvig.xyz/">Ludvig Alexander Brüchmann</a>.</p>
  </div>

</body>
