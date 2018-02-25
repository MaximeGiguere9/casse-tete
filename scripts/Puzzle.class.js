(function(window){

'use strict';

var Puzzle = function Puzzle(image, dimX, dimY, nbDivX, nbDivY){
	//avoir des divisions aux dimensions décimales cause des problèmes dans l'assemblage du puzzle
	//on trouve donc le plus grand nombre entier
	if(dimX%nbDivX != 0){
		console.log('Attention! dimX/nbDivX est décimal, dimX sera modifié. ' + dimX + ' -> ' + (dimX - dimX%nbDivX));
		dimX -= dimX%nbDivX;
	}
	if(dimY%nbDivY != 0){
		console.log('Attention! dimY/nbDivY est décimal, dimY sera modifié. ' + dimY + ' -> ' + (dimY - dimY%nbDivY));
		dimY -= dimY%nbDivY;
	}
	this.image = image;
	Grille.call(this, dimX, dimY, nbDivX, nbDivY);
	this.nbPiecesPlacees = 0;
	this.nbPieces = nbDivX * nbDivY;
};

Puzzle.prototype = Object.create(Grille.prototype);
Puzzle.prototype.constructor = Puzzle;

//requiert un élément avec l'id 'conteneurPieces'
//fabrique des elements div avec la classe 'pieces' et le data 'num-piece'
Puzzle.prototype.genererPieces = function(){
	var pieceDimX = this.dimX / this.nbDivX,
	pieceDimY = this.dimY / this.nbDivY;
	//commence par créér une grille
	this.genererGrille('conteneurPieces', 'pieces', 'num-piece');
	//puis ajoute une partie de l'image aux éléments créés par genererGrille
	for(var i = 0; i < document.getElementsByClassName('pieces').length; i++){
		document.getElementsByClassName('pieces')[i].style.backgroundImage = this.image;
		document.getElementsByClassName('pieces')[i].style.backgroundPosition = '-' + ((i % this.nbDivX) * pieceDimX) + 'px -' + ((Math.floor(i / this.nbDivX)) * pieceDimY) + 'px';
	}

	console.log('Nombre de pièces : ' + (this.nbDivX * this.nbDivY));
};

//requiert un élément avec l'id 'melangePieces'
//éparpille les pièces du puzzle
Puzzle.prototype.melanger = function(){
	var aPieces = document.getElementsByClassName('pieces');
	var conteneur = document.getElementById('melangePieces');
	var rotationPiece;
	//melange les pièces après une demi-seconde pour mieux visualiser la transition à partir de l'état initial
	setTimeout(function(){
		for(var i = 0; i < aPieces.length; i++){
			//transition des pièces
			aPieces[i].style.transition = "left 500ms, top 500ms, transform 500ms";
			//donne une position aléatoire à l'intérieur du conteneur 'melangePieces'
			aPieces[i].style.top = Math.random()*(parseFloat(conteneur.offsetHeight) - parseFloat(aPieces[i].offsetHeight)) + 'px';
			aPieces[i].style.left = Math.random()*(parseFloat(conteneur.offsetWidth) - parseFloat(aPieces[i].offsetWidth)) + 'px';
			//(la rotation est stockée en matrice, rendant la récupération de cette valeur plus complexe autrement)
			rotationPiece = Math.round(Math.random()*36)*10;
			aPieces[i].style.transform = 'rotate('+ rotationPiece + 'deg)';
			aPieces[i].dataset.rotation = rotationPiece;
			//supprime l'effet de transition quand on en a plus besoin 
			//car il cause aussi un délai dans le glissement et la rotation
			setTimeout(function(){
				for(var i = 0; i < aPieces.length; i++){
					aPieces[i].style.transition = "";
				}
			}, 1000);
		}
	}, 1000);
	//évidemment, les pièces ne sont plus placées
	this.nbPiecesPlacees = 0;
}

//requiert des éléments avec les classes 'cases' ou 'pieces'
//implemente la fonctionnalité drag and drop et le contrôle par touches
Puzzle.prototype.demarrerInteractivite = function(){
	//'this' va changer a travers le code suivant 
	//on doit garder l'objet Puzzle et la pièce controlée en mémoire pour pouvoir les toucher même si this change
	var puzzle = this;
	//utiliser bind créé une référence distincte, besoin de la garder en mémoire pour pouvoir enlever l'écouteur
	var fEvt;
	$('.pieces').draggable({
		revert : 'invalid',
        cursor: 'move',
        start: function(event, ui){
        	//controles de rotation des pieces
        	this.actif = true;
        	fEvt = puzzle.tournerPieces.bind(this);
        	window.addEventListener('keydown', fEvt);
        },
        stop: function(event, ui){
        	this.actif = false;
        	window.removeEventListener('keydown', fEvt);
        }
	});
	$('.cases').droppable({
		tolerance: 'intersect',
		accept: function(element){
			/*Note: WebKitCSSMatrix ne fonctionne pas sur tous les navigateurs pour le moment
			//la rotation est transformée en matrice, qu'on a pour pouvoir récupérer la rotation de la pièce
			//les valeurs d'une matrice 2D:
			//(m11,m12,m21,m22,m41,m42)
			//équivalence en degrés:
			//(1,0,0,1,0,0) = 0deg
			//(0,1,-1,0,0,0) = 90deg
			//(-1,0,0,-1,0,0) = 180deg
			//(0,-1,1,0,0,0) = -90deg
			var matricePiece = new WebKitCSSMatrix($(element).css('transform'));
			if(matricePiece.m11 >= 0.99 && matricePiece.m22 >= 0.99){*/
			if(Math.abs(element.context.dataset.rotation) <= 10 || Math.abs(element.context.dataset.rotation) >= 350){
				return ($(this).data('num-case') == element.data('num-piece'));
			} else{
				return false;
			}
		},
		drop: function(event, ui){
			//Désactive l'interactivité quand la pièce est placée
			ui.helper.css('transition', 'left 500ms, top 500ms');
			ui.helper.css('transform', 'rotate(0deg)');
			ui.helper.draggable('disable');
			puzzle.nbPiecesPlacees ++;
          	ui.draggable.position({
            	of: $(this), 
            	at: 'center'
          	});
        }
	});
};

Puzzle.prototype.tournerPieces = function(evt){
	//this est attaché à la pièce en glissement
	if(this.actif){
		if(evt.keyCode == 37){
			//rotation dans le sens anti-horaire (fleche gauche)
			this.dataset.rotation = (parseInt(this.dataset.rotation) - 10)%360;
			$(this).css('transform', $(this).css('transform') + 'rotate('+ (-10) + 'deg)');
		}else if(evt.keyCode == 39){
			//rotation dans le sens horaire (fleche droite)
			this.dataset.rotation = (parseInt(this.dataset.rotation) + 10)%360;
			$(this).css('transform', $(this).css('transform') + 'rotate('+ (10) + 'deg)');
		}
	}
}

window.Puzzle = Puzzle;

})(window);