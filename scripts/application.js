(function(window){

'use strict';

window.addEventListener("load", function  (event) {

	//état initial
	$('#intro section').css({
		'width': '0',
		'height': '0'
	});
	$('#intro section').children().css({
		'opacity':'0'
	});
	$('h1').css({
		'opacity':'0',
		'letter-spacing':'50px'
	});
	//animation d'introduction
	$('#intro section').animate({'width': '48%'}, {
		duration:1000,
		complete:function(){
			$('h1').animate({'opacity':'1', 'letter-spacing':'1px'});
			$('#intro section').animate({'height': '200px'}, {
				duration:1000,
				complete:function(){	
					$('#intro section').children().animate({'opacity': '1'});
					//pour régler un problème de division rebelle
					$('#intro section').last().css({'transform':'translate(0,-33px)'});
				}
			});
		}
	});

	//Jeu prend 2 paramètres: un objet Puzzle et un objet InterfaceJeu. 
	//Puzzle requert l'image et les dimensions du puzzle
	//InterfaceJeu requiert un objet Score
	//Score requiert le titre de la liste de score
	var jeu = new Jeu(new Puzzle("url('img/image.jpg')", 500, 375, 1, 1), new InterfaceJeu(new Score('Giguere_Maxime_TP2_scores_niveau0')));
	document.getElementById('jouerBtn').addEventListener('click', function(){
		jeu.commencerPartie();
	});	

});

})(window);
