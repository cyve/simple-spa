<?php
    sleep(1);
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Search - SimpleSPA</title>
		<meta charset="UTF-8">
	</head>
	<body>
		<div id="content">
			<header>
				<nav>
					<ul>
						<li><a href="index.html">Home</a></li>
						<li><a href="page1.html">Page 1</a></li>
					</ul>
				</nav>
			</header>
			<main>
				<h1>Search results for "<?php echo $_GET['q'] ?>"</h1>
				<ul>
					<li><a href="page1.html">Page 1</a></li>
				</ul>
			</main>
		</div>
        <script src="../dist/simple-spa.js"></script>
	</body>
</html>
