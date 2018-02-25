(function(window){

'use strict';

var Jeu = function Jeu(puzzle, interfaceJeu){
	//variables reliées à la minuterie
	this.minuterie = null;
	this.tempsInitial = 0;
	this.tempsEcoule = 0;
	//au jeu
	this.puzzle = puzzle;
	//à interface
	this.interfaceJeu = interfaceJeu;
	this.etat = 'debut';
	//complète l'interface initiale
	this.puzzle.genererGrille();
	//actualiser l'interface quand on change le niveau de difficulté pour afficher les scores appropriés
	document.getElementById('difficulte').addEventListener('change', function(){
		this.interfaceJeu.scores.setDifficulte(document.getElementById('difficulte').selectedIndex);
		this.interfaceJeu.update('score');
	}.bind(this) );
};

//génère, affiche et démarre le puzzle
Jeu.prototype.commencerPartie = function() {
	console.log('Niveau de difficulté : ' + this.interfaceJeu.txtNiveau);
	//modification du puzzle et du score selon le niveau de difficulté
	var niveau = document.getElementById('difficulte').selectedIndex;
	this.puzzle = new Puzzle(this.puzzle.image, this.puzzle.dimX, this.puzzle.dimY, 2 + Math.pow(2, niveau), 2 + Math.pow(2, niveau));
	this.interfaceJeu.scores.setDifficulte(niveau);
	//supprime les pièces afin de prévenir la duplication si on démarre une n-ième partie
	$('#conteneurPieces').empty();
	$('#conteneurGrille').empty();
	//génération des pièces et des autres parties du jeu
	this.interfaceJeu.update('partie');
	this.puzzle.genererGrille();
	this.puzzle.genererPieces();
	this.puzzle.melanger();
	this.puzzle.demarrerInteractivite();
	//ajout de la minuterie
	this.tempsInitial = Date.now();
	this.interfaceJeu.update('minuterie', 0);
	this.minuterie = setInterval(this.actualiserTemps.bind(this), 1000);
};

//actualise et affiche le temps écoulé
Jeu.prototype.actualiserTemps = function() {
	//minuterie
	this.tempsEcoule = Math.floor((parseInt(Date.now()) - parseInt(this.tempsInitial))/1000);
	this.interfaceJeu.update('minuterie', this.tempsEcoule);
	//termine la partie quand toutes les pièces sont placées
	if(this.puzzle.nbPiecesPlacees == this.puzzle.nbPieces){
		clearInterval(this.minuterie);
		this.interfaceJeu.update('minuterie', null);
		this.interfaceJeu.scores.ajouter(this.tempsEcoule);
		this.interfaceJeu.update('fin', this.tempsEcoule);
	}
};

window.Jeu = Jeu;
	
})(window);