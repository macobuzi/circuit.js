(function ($){
	var Circuit = function(target, numberString, config) {
		// Class members
		this.canvas;
		this.digitLen;
		this.heightInSquare;
		this.widthInSquare;
		this.squareSize;
		this.context;
		this.drawWidth;
		this.drawHeight;
		this.shapeWidth;
		this.numberString;
		this.config;
		this.timer;
		
		// Initialize
		this.initialize(target, numberString, config);
		
		// Set up motion
		this._setupMotion();
	}
	
	$.extend(Circuit.prototype, {
		/*  Each digit is represented by 7 lines and have the size 4x7 squares.
			
			- 0 -
			|   |
			1   2
			|   |
			- 3 -
			|   |
			4   5
			|	|
			- 6 -
		 */
		LINE_NUMBER : 7,
		DIGIT_SHAPE_WIDTH : 4,
		DIGIT_SHAPE_HEIGHT : 7,
		
		/*
			The digit shape corresponding to each number dertermines which line
			will be visible (true means visible).
			
			Line:     0		 1      2      3     4      5      6		
		 */
		DIGIT_SHAPES : {		
			0: [true,  true,  true,  false, true,  true,  true],
			1: [false, false, true,  false, false, true, false],
			2: [true,  false, true,  true,  true,  false, true],
			3: [true,  false, true,  true,  false, true,  true],
			4: [false, true,  true,  true,  false, true, false],
			5: [true,  true,  false, true,  false, true,  true],
			6: [true,  true,  false, true,  true,  true,  true],
			7: [true,  false, true,  false, false, true, false],
			8: [true,  true,  true,  true,  true,  true,  true],
			9: [true,  true,  true,  true,  false, true, true]
		},
		
		initialize: function(target, numberString, config) {
			// Initialize share variable
			this.canvas = target;
			this.numberString = numberString;
			this.context = this.canvas.getContext('2d');
			this.digitLen = this.numberString.length;			
			this.shapeWidth = this.DIGIT_SHAPE_WIDTH;
			this.heightInSquare = this.DIGIT_SHAPE_HEIGHT;
			this.widthInSquare = this.shapeWidth * this.digitLen + this.digitLen + 1;			
			
			// Get appropriate square size
			this.squareSize = Math.min(
				this.canvas.height / this.heightInSquare,
				this.canvas.width / this.widthInSquare
			);
			this.drawWidth = this.widthInSquare * this.squareSize;
			this.drawHeight = this.heightInSquare * this.squareSize;	
			
			// Get configuration
			this.config = config || {};
			this.config.background = this.config.background || 'white';
			this.config.foreground = this.config.foreground || 'black';
			this.config.gridcolor = this.config.gridcolor || 'black';
			this.config.motion = this.config.motion || 'no';
			this.config.interval = this.config.interval || 1000;
		},
		
		_setupMotion: function() {
			var temp = '', that = this;
			if (this.config.motion == 'yes') {
				this.draw(temp);
				this.timer = setInterval(function() {
					if (temp.length < that.numberString.length) {
						temp += that.numberString[temp.length];
					} else {
						temp = '';
					}
					that.draw(temp);
				}, this.config.interval);
			} else {
				this.draw(this.numberString);
			}
		},
		
		draw: function(string) {
			// Fill background
			this.context.fillStyle = this.config.background;
			this.context.fillRect(0, 0, this.drawWidth, this.drawHeight);			
			
			// Draw grid and digits
			this.context.strokeStyle = this.config.gridcolor;			
			this.context.beginPath();						
			this._drawGrid();			
			this.context.fillStyle = this.config.foreground;
			this._drawDigits(string);			
			
			// Finalize
			this.context.stroke();						
			this.context.closePath();	
		},
		
		_drawGrid: function() {			
			for (var x=0; x<=this.widthInSquare; x++) {
				this.context.moveTo(x * this.squareSize, 0);
				this.context.lineTo(x * this.squareSize, this.drawHeight);				
			}
			for (var y=0; y<=this.heightInSquare; y++) {
				this.context.moveTo(0, y * this.squareSize);
				this.context.lineTo(this.drawWidth, y * this.squareSize);
			}
		},
		
		_drawDigits: function(string) {
			var number, shape, offsetX, offsetY;			
			for (var i=0; i<string.length; i++) {
				number = parseInt(string[i], 10);
				shape = this.DIGIT_SHAPES[number];
				offsetX = (this.shapeWidth * i + i + 1) * this.squareSize;
				offsetY = 0;
				for (var row=0; row<this.heightInSquare; row++) {
					// Upper part
					if (row == 0) {
						for (var k=0; k<this.shapeWidth; k++) {
							this._drawSquare(offsetX, offsetY, row, k, shape[0]);
						}
					}					
					// Between upper and middle part
					if (row == 1 || row == 2) {
						this._drawSquare(offsetX, offsetY, row-1, 0, shape[1]);
						this._drawSquare(offsetX, offsetY, row, 0, shape[1]);
						this._drawSquare(offsetX, offsetY, row+1, 0, shape[1]);
						this._drawSquare(offsetX, offsetY, row-1, this.shapeWidth-1, shape[2]);
						this._drawSquare(offsetX, offsetY, row, this.shapeWidth-1, shape[2]);
						this._drawSquare(offsetX, offsetY, row+1, this.shapeWidth-1, shape[2]);
					}
					// Middle part
					if (row == 3) {
						for (var k=0; k<this.shapeWidth; k++) {
							this._drawSquare(offsetX, offsetY, row, k, shape[3]);
						}
					}
					// Between middle and lower part
					if (row == 4 || row == 5) {
						this._drawSquare(offsetX, offsetY, row-1, 0, shape[4]);
						this._drawSquare(offsetX, offsetY, row, 0, shape[4]);
						this._drawSquare(offsetX, offsetY, row+1, 0, shape[4]);
						this._drawSquare(offsetX, offsetY, row-1, this.shapeWidth-1, shape[5]);
						this._drawSquare(offsetX, offsetY, row, this.shapeWidth-1, shape[5]);
						this._drawSquare(offsetX, offsetY, row+1, this.shapeWidth-1, shape[5]);
					}
					// Lower part
					if (row == 6) {
						for (var k=0; k<this.shapeWidth; k++) {
							this._drawSquare(offsetX, offsetY, row, k, shape[6]);
						}
					}
				}				
			}			
		},
		
		_drawSquare: function(offsetX, offsetY, row, squareIndex, visible) {
			var x, y;
			x = offsetX + squareIndex * this.squareSize;
			y = offsetY + row * this.squareSize;
			if (visible) {
				this.context.fillRect(x,y, this.squareSize, this.squareSize);
			}	
		}
	});
	
	$.fn.circuit = function(numberString, config) {
		var board = new Circuit($(this)[0], numberString, config);
	}
})(jQuery);