(function(window){

'use strict';

var InterfaceJeu = function InterfaceJeu(scores){
	
	this.txtNiveau = null;
	this.scores = scores;

	this.txtInstructions = "<h2>Instructions</h2>\
	<p>Placez les pièces dans la grille pour former une image.\
	Cliquez et glissez la souris pour déplacer les pièces,\
	appuyez sur les flèches gauche et droite de votre clavier pour les faire pivoter,\
	puis relâchez la souris pour laisser la pièce à son emplacement.\
	Attention! Les pièces placées de manière erronée seront renvoyées à leur position initiale.</p>";

	this.update('debut');
};

//fonction à être utilisée à l'extérieur de la classe
//appelle les autres fonctions
InterfaceJeu.prototype.update = function(etat, value) {
	switch(etat){
		case 'debut':
			this.afficherInstructions();
			break;
		case 'partie':
			this.afficherPartie();
			break;
		case 'fin':
			this.afficherResultat(value);
			break;
		case 'minuterie':
			this.afficherMinuterie(value);
			break;
		case 'score':
			this.afficherScores();
			break;
		default:
			console.log('Paramètres invalides.');
			break;
	}
};

//affiche les 5 meilleurs scores pour la difficulté actuelle dans une balise table avec l'id "scores"
InterfaceJeu.prototype.afficherScores = function() {

	//nom du niveau extrait de la liste
	this.txtNiveau = document.getElementById('difficulte').getElementsByTagName('option')[document.getElementById('difficulte').selectedIndex].innerHTML;
	//titre
	document.getElementById('scoresNiv').innerHTML = 'Meilleurs temps (' + this.txtNiveau + ')';
	//contenu
	var tableauScores = "<tr><td>Date</td><td>Temps</td></tr>";
	for(var i = 0; i < 5; i++){
		tableauScores += "<tr>\
		<td>" + this.scores.afficher('date', i) + " " + this.scores.afficher('heure', i) +"</td>\
		<td class='scoreTemps'>" + this.scores.afficher('temps', i) + "</td></tr>";
	}
	document.getElementById('scores').innerHTML = tableauScores;
};

//affiche les instructions et update le tableau de scores
InterfaceJeu.prototype.afficherInstructions = function() {
	
	document.getElementById('message').innerHTML = this.txtInstructions;
	document.getElementById('jouerBtn').innerHTML = 'Jouer';
	document.getElementById('jouerBtn').disabled = false;
	document.getElementById('difficulte').disabled = false;
	this.afficherScores();
};

//modifie l'interface pour la situation actuelle (partie en cours)
InterfaceJeu.prototype.afficherPartie = function() {

	this.afficherInstructions();
	document.getElementById('jouerBtn').innerHTML = 'Partie en cours';
	document.getElementById('jouerBtn').disabled = true;
	document.getElementById('difficulte').disabled = true;
};

//modifie l'interface pour la situation actuelle (fin de la partie) et affiche le résultat
InterfaceJeu.prototype.afficherResultat = function(resultat) {
	
	var txtResultat = "<h2>Félicitations</h2>\
	<p>Vous avez réussi à reconstituer l'image en " + 
	(resultat > 60? Math.floor(resultat/60) + " minute(s) " : "")
	+ resultat%60 + " seconde(s) au niveau " + this.txtNiveau + ".</p>";

	this.afficherInstructions();
	document.getElementById('message').innerHTML = txtResultat;
	document.getElementById('jouerBtn').innerHTML = 'Rejouer';
};

// affiche/actualise la minuterie
InterfaceJeu.prototype.afficherMinuterie = function(temps) {

	if(temps != null){
		document.getElementById('minuterie').innerHTML = ("Temps Écoulé: " + Math.floor(temps/60) + " minute(s) "
		+ (temps%60 < 10 ? "0" + temps%60 : temps%60) + " seconde(s).");
	} else{
		document.getElementById('minuterie').innerHTML = "";
	}	
};

window.InterfaceJeu = InterfaceJeu;
	
})(window);