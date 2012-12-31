#JQuery plugin to perform LCD display
Demo: <a href='http://circuitjs.appspot.com'>http://circuitjs.appspot.com</a>

##Easy to use</h2>
We start with a canvas:

		<body><canvas></canvas></body>
		
After including `JQuery` and `circuit.js`, we can perform LCD display.

		<script>
			$(document).ready(function() {
			  $('canvas').circuit('123456789', {
				foreground: 'red',
				background: 'yellow',
				gridcolor: 'green',
				motion: 'yes',    
				interval: 1000
			  });
			});
		</script>
		