(function(window){

"use strict";

var Score = function Score(nom){
	this.nom = nom;
	this.listeScores = null;
	this.creerListeScore();
};

//change le nom du fichier selon la difficulté et regénère la liste
Score.prototype.setDifficulte = function(difficulte) {
	this.nom = 'Giguere_Maxime_TP2_scores_niveau' + difficulte;
	this.creerListeScore();
};

Score.prototype.creerListeScore = function() {
	//cherche la liste, ou en place une nouvelle si elle n'existe pas
	if(localStorage.getItem(this.nom) == null){
		console.log("Création d'une nouvelle liste de scores.");
		this.listeScores = [
			{date:new Date(2000,0,1), temps:59999},
			{date:new Date(2000,0,1), temps:59999},
			{date:new Date(2000,0,1), temps:59999},
			{date:new Date(2000,0,1), temps:59999},
			{date:new Date(2000,0,1), temps:59999}
		];
		localStorage.setItem(this.nom, JSON.stringify(this.listeScores));
	} else{
		//console.log("Liste de scores touvée.");
		this.listeScores = JSON.parse(localStorage.getItem(this.nom));
	}
};

Score.prototype.ajouter = function(temps) {
	var date = new Date();
	//ajustement du fuseau horaire
	date.setHours(date.getHours()-5);
	//placement du nouveau temps
	//les temps son classés du plus petit au plus grand
	var i = 0;
	while(temps > this.listeScores[i].temps){i++;}
	this.listeScores.splice(i, 0, {date:date, temps:temps});
	//enregistre la liste
	localStorage.setItem(this.nom, JSON.stringify(this.listeScores));
	console.log('Liste de scores: ', this.listeScores);
};

Score.prototype.afficher = function(valeur, index){
	//actualise la liste pour s'assurer qu'il n'y ait pas d'erreurs dans l'affichage
	this.creerListeScore();
	//manipulations des chaînes
	switch(valeur){
		case 'date':
			return this.listeScores[index].date.toString().split('T')[0];
			break;
		case 'heure':
			return this.listeScores[index].date.toString().split('T')[1].split('.')[0];
			break;
		case 'temps':
			return Math.floor(this.listeScores[index].temps/60) + ":" + 
			//ajoute un zéro si la valeur de secondes n'a qu'un seul chiffre (pour uniformiser le format d'affichage)
			(this.listeScores[index].temps%60 < 10 ? "0" + this.listeScores[index].temps%60 : this.listeScores[index].temps%60);
			break;
		default:
			console.log('Paramètres invalides.');
			break;
	}
};


window.Score = Score;

})(window);