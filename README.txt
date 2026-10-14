HBF — site vitrine HTML / CSS / JavaScript
==========================================

Recréation modernisée du site public https://www.hbf.bj/
Textes, couleurs (bleu marine + rouge) et contenu officiels conservés.
Nouveau logo (globe + HBF) fourni par le client.

Pages
-----
index.html                      Accueil
activites.html                  Nos activités
realisations.html               Nos réalisations
a-propos.html                   À propos et équipe
contact.html                    Coordonnées et formulaire
politique-confidentialite.html  Politique de confidentialité
mentions-legales.html           Mentions légales

Lancer
------
Ouvrez index.html dans un navigateur, ou servez le dossier :

  python -m http.server 4173

puis allez sur http://127.0.0.1:4173/

Notes
-----
- Les photos et logos partenaires sont ceux publiés sur hbf.bj.
- Le formulaire ouvre un e-mail vers hbf@hbf.bj (mailto).
- Les compteurs « 0 k » du site WordPress d’origine n’ont pas été recopiés tels quels : les libellés Réalisations / Partenaires / Clients sont conservés.
- Certains textes officiels (politique, mentions) contiennent encore des champs vides (________) présents sur le site actuel.

Version WOW
-----------
assets/css/wow.css et assets/js/wow.js ajoutent : préchargeur, titres animés mot par mot,
parallaxe, compteurs (99k / 5k / 25+ / 250+), cartes 3D avec projecteur lumineux, boutons magnétiques,
apparition progressive au scroll, transitions entre pages, barre de progression, bouton haut de page.
Les textes, couleurs (bleu marine + rouge) et photos d'origine sont inchangés.
Pour revenir à la version simple : retirer les deux lignes wow.css / wow.js dans les <head>.

Langues FR / EN / 中文
----------------------
assets/js/i18n.js ajoute un sélecteur de langue (globe, en haut à droite) : Français, English, 中文.
Le choix est mémorisé ; on peut aussi forcer une langue avec ?lang=en ou ?lang=zh.
Les traductions sont dans le dictionnaire en tête de i18n.js : le texte français d'origine est la clé,
[anglais, chinois] la valeur. Pour modifier un texte français dans le HTML, mettre à jour la clé correspondante.
Le corps du mail du formulaire de contact reste en français.
