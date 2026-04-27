export const MODULES_CATALOG = [
  { id: 'additions', title: 'Additions', desc: 'Maîtriser les sommes rapides' },
  { id: 'soustractions', title: 'Soustractions', desc: 'Calcul de différences' },
  { id: 'multiplications', title: 'Multiplications', desc: 'Tables et astuces calculatoires' },
  { id: 'divisions', title: 'Divisions', desc: 'Partages et quotients' },
  { id: 'fractions', title: 'Fractions / simplification', desc: 'Simplification rapide par réflexe visuel' },
  { id: 'decimaux', title: 'Décimaux / pourcentages', desc: 'Lien décimal et pourcentage' },
  { id: 'arrondis', title: 'Arrondis', desc: 'Capacité à estimer à l\'unité ou la décimale' },
  { id: 'conversions', title: 'Conversions de longueurs', desc: 'Tableau de conversion mental' },
  { id: 'mult10', title: 'x10 x100 x1000', desc: 'Décaler la virgule vers la droite' },
  { id: 'div10', title: '÷10 ÷100 ÷1000', desc: 'Décaler la virgule vers la gauche' },
];

export const MODULES_TIPS = {
  additions: {
    intro: "L'addition mentale nécessite de réorganiser les nombres pour calculer plus vite et sans erreur.",
    rules: [
      { title: "Décomposer les nombres", content: "Sépare les dizaines et les unités pour les additionner séparément." },
      { title: "Chercher les compléments à 10", content: "Regroupe en priorité les nombres qui finissent par faire des dizaines entières (ex: 7 et 3, 4 et 6)." }
    ],
    examples: [
      { eq: "45 + 32", desc: "(40 + 30) = 70, (5 + 2) = 7. Total : 77" },
      { eq: "58 + 14", desc: "Ajoute d'abord 10 : 58 + 10 = 68. Puis ajoute 4 : 68 + 4 = 72." }
    ],
    pitfalls: [
      "Vouloir tout calculer de droite à gauche (comme posé sur le papier). De tête, il est bien plus facile de faire de gauche à droite (dizaines puis unités) !"
    ]
  },
  soustractions: {
    intro: "Soustraire de tête, c'est comme calculer l'écart entre deux nombres. Trouve la méthode qui te convient le mieux.",
    rules: [
      { title: "Soustraire par paliers", content: "Retire d'abord les dizaines, puis les unités." },
      { title: "Avancer pour soustraire (Complément)", content: "Au lieu de reculer, demande-toi : 'Combien faut-il pour aller de... à... ?' C'est particulièrement utile quand les nombres sont proches." }
    ],
    examples: [
      { eq: "74 - 21", desc: "Retire 20 (il reste 54), puis retire 1. Résultat : 53." },
      { eq: "102 - 98", desc: "Ne pose pas le calcul ! Cherche l'écart : de 98 à 100 il y a 2, de 100 à 102 il y a 2. L'écart est de 4." }
    ],
    pitfalls: [
      "Oublier de retenir mentalement le résultat intermédiaire quand tu décomposes.",
      "Se tromper lors du franchissement de la dizaine (ex: 52 - 8)."
    ]
  },
  multiplications: {
    intro: "La multiplication de tête repose sur les tables de multiplication et la décomposition de nombres complexes.",
    rules: [
      { title: "Les tables, la base", content: "Aucun secret : il faut connaître parfaitement ses tables de 1 à 10." },
      { title: "Multiplier par 4 ou 8", content: "Multiplier par 4 c'est doubler, puis doubler encore. Multiplier par 8, c'est doubler 3 fois." },
      { title: "Multiplier par 5", content: "Multiplier par 5 revient à multiplier par 10 puis diviser par 2." }
    ],
    examples: [
      { eq: "14 × 5", desc: "14 × 10 = 140. Puis 140 ÷ 2 = 70." },
      { eq: "12 × 4", desc: "Double de 12 = 24. Double de 24 = 48." }
    ],
    pitfalls: [
      "Hésiter sur les tables centrales (7×8, 6×7, 8×8). Révise-les en priorité !"
    ]
  },
  divisions: {
    intro: "Diviser de tête, c'est l'opération inverse de la multiplication. C'est l'art de partager.",
    rules: [
      { title: "Chercher le quotient multiplicatif", content: "Pour 56 ÷ 8, demande-toi : 'Dans la table de 8, qu'est-ce qui fait 56 ?'" },
      { title: "Diviser par 4", content: "C'est prendre la moitié, puis encore la moitié." },
      { title: "Simplifier les zéros", content: "S'il y a des zéros à la fin des deux nombres, tu peux en enlever le même nombre de chaque côté (ex: 400 ÷ 20 = 40 ÷ 2)." }
    ],
    examples: [
      { eq: "72 ÷ 9", desc: "Dans la table de 9, c'est 9 × 8 = 72. Donc le résultat est 8." },
      { eq: "100 ÷ 4", desc: "Moitié de 100 = 50. Moitié de 50 = 25." }
    ],
    pitfalls: [
      "Confondre le quotient et le reste.",
      "Oublier de simplifier les zéros quand c'est possible."
    ]
  },
  fractions: {
    intro: "Simplifier une fraction, c'est trouver un diviseur commun au numérateur et au dénominateur pour l'écrire avec les plus petits nombres possibles.",
    rules: [
      { title: "Critère de divisibilité par 2", content: "Si le nombre se termine par 0, 2, 4, 6 ou 8, il est divisible par 2." },
      { title: "Critère de divisibilité par 5", content: "Si le nombre se termine par 0 ou 5, il est divisible par 5." },
      { title: "Critère de divisibilité par 3", content: "Si la somme des chiffres du nombre est dans la table de 3, alors le nombre l'est aussi (ex: 18 -> 1+8=9, donc divisible par 3)." }
    ],
    examples: [
      { eq: "12/18", desc: "C'est pair. Divisé par 2 : 6/9. Divisible par 3 : 2/3. On ne peut plus simplifier, la fraction est irréductible." },
      { eq: "25/40", desc: "Les deux finissent par 5 ou 0. On divise par 5. Résultat : 5/8." }
    ],
    pitfalls: [
      "Ne pas simplifier jusqu'au bout. Toujours se demander à la fin : 'Puis-je encore diviser les deux nombres ?'",
      "Oublier qu'il faut absolument diviser par LE MÊME nombre en haut et en bas."
    ]
  },
  decimaux: {
    intro: "Le passage des fractions aux décimaux et aux pourcentages est fondamental. C'est la même proportion écrite différemment.",
    rules: [
      { title: "Les quarts et moitiés", content: "1/2 = 0,5 = 50%. 1/4 = 0,25 = 25%. 3/4 = 0,75 = 75%." },
      { title: "Les dixièmes", content: "1/10 = 0,1 = 10%." }
    ],
    examples: [
      { eq: "25% de 40", desc: "25%, c'est un quart. Un quart de 40 (40 ÷ 4), c'est 10." },
      { eq: "0,5 × 18", desc: "Multiplier par 0,5 revient à prendre la moitié. La moitié de 18 est 9." }
    ],
    pitfalls: [
      "Confondre 0,1 et 0,01. 1/10 c'est 0,1 (1 chiffre après la virgule). 1/100 c'est 0,01 (2 chiffres après la virgule)."
    ]
  },
  arrondis: {
    intro: "L'arrondi permet de simplifier les nombres pour faire des calculs de tête approximatifs (des ordres de grandeur).",
    rules: [
      { title: "La règle du 5", content: "Regarde le chiffre juste après celui que tu veux arrondir. S'il est 5, 6, 7, 8 ou 9, on arrondit au supérieur." },
      { title: "Moins de 5", content: "Si le chiffre d'après est 0, 1, 2, 3 ou 4, on arrondit à l'inférieur." }
    ],
    examples: [
      { eq: "Arrondir 14,7 à l'unité", desc: "Le chiffre après la virgule est 7 (supérieur à 5). On arrondit à 15." },
      { eq: "Arrondir 3,14 au dixième", desc: "Le chiffre des centièmes est 4 (inférieur à 5). On garde 3,1." }
    ],
    pitfalls: [
      "Regarder le mauvais chiffre. Si on demande d'arrondir à l'unité, c'est le chiffre des dixièmes qu'il faut regarder !"
    ]
  },
  conversions: {
    intro: "Convertir de tête demande de bien visualiser le tableau des unités (km, hm, dam, m, dm, cm, mm).",
    rules: [
      { title: "Vers une unité plus petite", content: "On va vers la droite, donc on multiplie par 10 à chaque case (on décale la virgule vers la droite ou on ajoute des zéros)." },
      { title: "Vers une unité plus grande", content: "On va vers la gauche, donc on divise par 10 à chaque case (on décale la virgule vers la gauche)." }
    ],
    examples: [
      { eq: "Convertir 5 m en cm", desc: "Du mètre au centimètre, il y a 2 cases vers la droite (dm, puis cm). On fait 5 × 100 = 500 cm." },
      { eq: "Convertir 450 mm en m", desc: "Du mm au m, 3 cases vers la gauche. On décale de 3 : 0,45 m." }
    ],
    pitfalls: [
      "Oublier une unité intermédiaire (par exemple oublier les décamètres dam entre hm et km)."
    ]
  },
  mult10: {
    intro: "Multiplier par 10, 100 ou 1000 ne nécessite aucun calcul, juste un déplacement !",
    rules: [
      { title: "Le principe", content: "Multiplier par 10, c'est rendre le nombre 10 fois plus grand. On décale la virgule de 1 rang vers la droite." },
      { title: "Pour 100 ou 1000", content: "Autant de zéros, autant de rangs ! 2 zéros pour 100 (2 rangs), 3 zéros pour 1000 (3 rangs)." },
      { title: "Ajouter des zéros", content: "S'il n'y a plus de chiffres après la virgule, on ajoute des zéros." }
    ],
    examples: [
      { eq: "3,14 × 10", desc: "Un rang vers la droite : 31,4." },
      { eq: "5,2 × 100", desc: "Deux rangs. Un rang donne 52. Il en manque un, on ajoute un zéro : 520." }
    ],
    pitfalls: [
      "Penser que multiplier par 10 consiste toujours à 'ajouter un zéro à la fin'. Pour 3,14 ça ne fait pas 3,140 !"
    ]
  },
  div10: {
    intro: "Diviser par 10, 100 ou 1000, c'est rendre le nombre plus petit en déplaçant la virgule.",
    rules: [
      { title: "Le principe", content: "Diviser par 10, c'est rendre 10 fois plus petit. On décale la virgule de 1 rang vers la gauche." },
      { title: "Pour 100 ou 1000", content: "100 -> 2 rangs à gauche. 1000 -> 3 rangs à gauche." },
      { title: "Ajouter des zéros devant", content: "S'il n'y a plus de chiffres, on met un zéro et une virgule devant." }
    ],
    examples: [
      { eq: "45,2 ÷ 10", desc: "Un rang vers la gauche : 4,52." },
      { eq: "7 ÷ 100", desc: "Deux rangs vers la gauche. Le 7 passe derrière, on ajoute un zéro : 0,07." }
    ],
    pitfalls: [
      "Se tromper de sens de décalage de la virgule en cas de stress. Souviens-toi : division = plus petit = vers la gauche !"
    ]
  },
  default: {
    intro: "Garde ton calme et analyse la question avant de te lancer dans le calcul.",
    rules: [
      { title: "Lecture de l'énoncé", content: "Prends le temps de bien lire les nombres en jeu et l'opération demandée." },
      { title: "Estimation rapide", content: "Avant de trouver la réponse exacte, trouve un ordre de grandeur." }
    ],
    examples: [
      { eq: "Astuce générale", desc: "La pratique régulière de 5 à 10 minutes par jour est plus efficace qu'une heure par semaine." }
    ],
    pitfalls: [
      "Se précipiter et faire une erreur d'inattention."
    ]
  }
};
