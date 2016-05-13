var play = (function(){
	
	/**
	 * Objects
	 */
	
	var setting = {};
	var action  = {};
	var scene   = {};
	var shapes  = {};
	var balls   = [];
	
	/**
	 * Setting
	 */
		
	setting.$el    = document.createElement('canvas');
	setting.$el.id = 'play';
	setting.c      = setting.$el.getContext('2d');

	setting.coord  = {};
	setting.degree = 2;
	setting.forces = {
		friction : {
			ground : 0.04,
			air    : 0.001
		},
		gravity : 0.1
	};

	/**
	 * Listner
	 */
	
	document.addEventListener("keydown", function(e){
		if(e.keyCode == 39 || e.keyCode == 68) {
			if( setting.coord.cannon.a > -65 )
				setting.coord.cannon.a += -setting.degree;
		}
		else if(e.keyCode == 37 || e.keyCode == 65) {
			if( setting.coord.cannon.a < 65 )
				setting.coord.cannon.a += setting.degree;
		} else if(e.keyCode == 38 || e.keyCode == 87) {
			if( setting.coord.cannon.a > 0 )
				setting.coord.cannon.a += -setting.degree;
			else if( setting.coord.cannon.a < 0 )
				setting.coord.cannon.a += setting.degree;
		} 

	}, false);

	document.addEventListener("keyup", function(e){
		if(e.keyCode == 32) {
			
			balls.push({
				x  : setting.coord.cannon.tx,
				y  : setting.coord.cannon.ty + setting.unit,
				vx : 2 * -Math.sin(setting.coord.cannon.a * Math.PI / 180),
				vy : 2 * Math.cos(setting.coord.cannon.a * Math.PI / 180),
				friction : false
			});

			console.log(balls[0])
		}
	})

	/**
	 * Actions
	 */
	
	action.draw = function(){
		setting.$el.height = window.innerHeight;
		setting.$el.width  = window.innerWidth;
		// setting.unit       = (setting.$el.height > setting.$el.width ? setting.$el.width : setting.$el.height) / 100;
		setting.unit       =  setting.$el.height / 100;


		setting.c.fillStyle = '#ccc';
		setting.c.fillRect( 
			0, 
			0, 
			setting.$el.width, 
			setting.$el.height 
		);

		scene.ground();
		scene.top();
		shapes.balls();
		scene.cannon();
	}

	/**
	 * Scenes
	 */
	
	scene.ground = function() {
		if( "undefined" == typeof setting.coord.ground ){
			setting.coord.ground = {
				x : 0,
				y : 95 * setting.unit, 
				w : setting.$el.width,
				h : 5 * setting.unit,
				c : '#666'
			}
		}

		setting.coord.ground.w = setting.$el.width;
		
		setting.c.fillStyle = setting.coord.ground.c;
		setting.c.strokeStyle = '#000';
		setting.c.lineWidth = 0.5 * setting.unit;
		
		setting.c.strokeRect(
			setting.coord.ground.x,
			setting.coord.ground.y,
			setting.coord.ground.w,
			setting.coord.ground.h
		);
		
		setting.c.fillRect(
			setting.coord.ground.x,
			setting.coord.ground.y,
			setting.coord.ground.w,
			setting.coord.ground.h
		);

	}

	/**
	 * Top
	 */
	
	scene.top = function() {

		if( "undefined" == typeof setting.coord.top ){
			setting.coord.top = {
				x : 0,
				y : 0, 
				w : setting.$el.width,
				h : 5 * setting.unit,
				c : '#666'
			}
		}
		
		setting.coord.top.w = setting.$el.width;

		setting.c.fillStyle = setting.coord.top.c;
		setting.c.strokeStyle = '#000';
		setting.c.lineWidth = 0.5 * setting.unit;

		setting.c.strokeRect( 
			setting.coord.top.x,
			setting.coord.top.y,
			setting.coord.top.w,
			setting.coord.top.h
		);

		setting.c.fillRect( 
			setting.coord.top.x,
			setting.coord.top.y,
			setting.coord.top.w,
			setting.coord.top.h
		);

	}

	/**
	 * cannon
	 */
	
	scene.cannon = function() {

		if( "undefined" == typeof setting.coord.cannon ){
			setting.coord.cannon = {
				x  : -setting.unit,
				y  : setting.unit, 
				w  : setting.unit * 2,
				h  : 12 * setting.unit,
				c  : '#0a0',
				a  : 0,
				tx : setting.$el.width / 2,
				ty : 0
			}
		}
		
		setting.c.translate(setting.coord.cannon.tx, setting.coord.cannon.ty + setting.unit);
		
		setting.c.rotate(setting.coord.cannon.a * Math.PI / 180);
		
		setting.c.fillStyle   = setting.coord.cannon.c;
		setting.c.strokeStyle = '#000';
		setting.c.lineWidth   = 0.5 * setting.unit;
		
		setting.c.strokeRect( 
			setting.coord.cannon.x,
			setting.coord.cannon.y,
			setting.coord.cannon.w,
			setting.coord.cannon.h
		);
		
		setting.c.fillRect( 
			setting.coord.cannon.x,
			setting.coord.cannon.y,
			setting.coord.cannon.w,
			setting.coord.cannon.h
		);
		
		setting.c.translate(-setting.coord.cannon.tx, -setting.coord.cannon.ty + setting.unit);
		
		setting.c.resetTransform();
	}

	/**
	 * shapes
	 */
	
	shapes.balls = function(){

		for (var i = balls.length - 1; i >= 0; i--) {

			vertical_limit = balls[i].friction ? setting.coord.top.h + setting.unit : 0;
			
			if( false == balls[i].friction && balls[i].y > setting.coord.top.h + setting.unit )
				balls[i].friction = true;
			 

			/**
			 * New Vel X
			 */
			
			if( balls[i].friction ){

				if( balls[i].vx > .5 * setting.forces.friction.ground){
					balls[i].vx += - setting.forces.friction.air;
				} else if( balls[i].vx < -.5 * setting.forces.friction.ground){
					balls[i].vx += + setting.forces.friction.air;
				} else {
					balls[i].vx = 0;
				}

			}

			/**
			 * Accelerations Events
			 */
			
			if( balls[i].y == setting.coord.ground.y - setting.unit ){
				
				if( balls[i].vy != 0 ) 
					balls[i].vy *= -0.5;

				if( balls[i].vx != 0 )
					balls[i].vx += balls[i].vx > 0 ? -setting.forces.friction.ground : setting.forces.friction.ground;
			
			} else if( balls[i].y == vertical_limit ){
				
				if( balls[i].vy != 0 ) 
					balls[i].vy *= -0.5;
				
				if( balls[i].vx != 0 ) 
					balls[i].vx += balls[i].vx > 0 ? -setting.forces.friction.ground : setting.forces.friction.ground;
			} 

			if( balls[i].x == setting.$el.width - setting.unit ){
				balls[i].vx *= -0.8;
			} else if( balls[i].x == 0 ){
				balls[i].vx *= -0.8;
			} 

			/**
			 * New Vel Y
			 */
			
			if( balls[i].friction ){
				balls[i].vy += setting.forces.gravity;
			}

			/**
			 * New Position
			 */
			
			balls[i].x += balls[i].vx * setting.unit;
			balls[i].y += balls[i].vy * setting.unit;

			/**
			 * Stop Position 
			 */

			if( balls[i].y > setting.coord.ground.y - setting.unit )
				balls[i].y = setting.coord.ground.y - setting.unit;

			if( balls[i].y <  vertical_limit )
				balls[i].y = vertical_limit;

			if( balls[i].x > setting.$el.width - setting.unit )
				balls[i].x = setting.$el.width - setting.unit;

			if( balls[i].x < 0 )
				balls[i].x = 0;

			/**
			 * Path
			 */

			setting.c.beginPath();
			setting.c.arc(
					balls[i].x,
					balls[i].y,
					setting.unit,
					0,
					Math.PI * 2,
					false
				);
			setting.c.fillStyle = '#fff';
			setting.c.fill();
			setting.c.stroke();
		}
	}

	/**
	 * Init
	 */
	
	document.body.appendChild(setting.$el);
	
	action.draw();

	setInterval(action.draw, 30);

	/**
	 * Returns
	 */
	
	return { 
		setting : setting,
		action  : action,
		scene   : scene,
		shapes  : shapes
	};
	// return action;

})()