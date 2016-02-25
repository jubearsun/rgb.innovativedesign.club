var app = angular.module('rgb', [])
  .controller('MainCtrl', ['$scope', '$document', function($scope, $document) {

    function animateWords() {
      var time = 0;
      $('.words').each(function() {
        $(this).delay(time).fadeIn(1000, 'swing');
        time += 600;
      });
    };

    $(document).ready(function() {
      animateWords();
    });

    function rand(min, max) {
      return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    var rgbArray = [360, 220, 120];

    function randomRGB() {
      var index = rand(0, 2);
      return rgbArray[index];
    }

    function resizeCanvas(canvas) {
      var height = window.innerHeight;
      var width = window.innerWidth;
      canvas.height = height;
      canvas.width = width;
    }

    var Part = function(canvas) {
      this.canvas = canvas;
      this.reset();
    };

    Part.prototype.reset = function() {
      // Radius
      this.startRadius = rand(1, 10);
      this.radius = this.startRadius;

      // Position
      this.x = rand(0, this.canvas.width);
      this.y = rand(0, this.canvas.height);

      // Color
      this.hue = randomRGB();
      this.saturation = rand(70, 85);
      this.lightness = rand(70, 80);
      this.startAlpha = 0.5;
      this.alpha = this.startAlpha;

      // Decay
      this.decayRate = .3;
      this.startLife = rand(20, 30);
      this.life = this.startLife;
      this.lineWidth = 1;
    }

    Part.prototype.update = function() {
      this.alpha = this.startAlpha * (this.life / this.startLife);
      this.radius = this.radius + 1;
      this.life -= this.decayRate;
    };

    Part.prototype.render = function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, '+this.alpha+')';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.fill();
    };

    setTimeout(function() {
      var canvas = document.getElementById('drops');
      var ctx = canvas.getContext('2d');
      var parts = [];
      var globalTick = 0;

      var updateParts = function() {
        var i = parts.length;

        while (i--) {
          if (parts[i].life < 0) {
            parts.splice(i, 1)
          }

          parts[i].update();
        }
      };

      var renderParts = function() {
        var i = parts.length;

        while (i--) {
          parts[i].render(ctx);
        }
      };

      var clear = function() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rga(255, 255, 255, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      };

      for (i = 0; i < 200; i++) {
        if (globalTick % 30 == 0) {
          parts.push(new Part(canvas));
        }

        updateParts();
        globalTick++;
      }

      var loop = function() {
        window.requestAnimFrame(loop, canvas);
        clear();

        if (globalTick % 30 == 0){
          parts.push(new Part(canvas));
        }

        updateParts();
        renderParts();
        globalTick++;
      };

      window.requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a){window.setTimeout(a,1E3/60)}
      }();

      resizeCanvas(canvas);
      window.onresize = function(event) {
        resizeCanvas(canvas);
      };

      loop();

    }, 1);

  }]);
