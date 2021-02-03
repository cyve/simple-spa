<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Register - SimpleSPA</title>
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
				<h1>Welcome <?php echo $_POST['name'] ?>!</h1>
			</main>
		</div>
        <script src="../dist/simple-spa.js"></script>
	</body>
</html>
