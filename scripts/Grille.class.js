(function(window){

'use strict';

var Grille = function Grille(dimX, dimY, nbDivX, nbDivY){
	this.dimX = dimX;
	this.dimY = dimY;
	this.nbDivX = nbDivX;
	this.nbDivY = nbDivY;
};

//requiert un élément dans le fichier HTML: <div id='conteneurGrille'>
//fabrique des éléments div avec la classe 'cases' et le data 'num-case'
Grille.prototype.genererGrille = function(nomConteneur, nomClasse, nomData) {
	//valeurs par défaut
	nomConteneur = nomConteneur || 'conteneurGrille';
	nomClasse = nomClasse || 'cases';
	nomData = nomData || 'num-case';
	
	var elm,
	pieceDimX = this.dimX / this.nbDivX,
	pieceDimY = this.dimY / this.nbDivY,
	conteneur = document.getElementById(nomConteneur);
	conteneur.style.width = this.dimX + 'px';
	conteneur.style.height = this.dimY + 'px';
	//création des pièces
	for (var i = 0; i < (this.nbDivX * this.nbDivY); i++) {
		elm = document.createElement('div');
		elm.className = nomClasse;
		elm.style.width = pieceDimX + 'px';
		elm.style.height = pieceDimY + 'px';
		elm.style.left = (i % this.nbDivX) * pieceDimX + 'px';
		elm.style.top = (Math.floor(i / this.nbDivX)) * pieceDimY + 'px';
		elm.style.display = 'inline-block';
		elm.style.position = 'absolute';
		$(elm).data(nomData, i);
		conteneur.appendChild(elm);
	};

};

window.Grille = Grille;

})(window);