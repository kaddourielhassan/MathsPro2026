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
  fractions: [
    "Astuce 1 : repérer les nombres pairs",
    "Astuce 2 : repérer les nombres finissant par 0 ou 5",
    "Astuce 3 : vérifier la divisibilité par 3 (somme des chiffres)",
    "Astuce 4 : utiliser les tables connues"
  ],
  multiplications: [
    "Astuce 1 : décomposer (ex: 8 x 6 = (5 x 6) + (3 x 6))",
    "Astuce 2 : connaître les tables de 1 à 10 par cœur"
  ],
  default: [
    "Prends ton temps pour lire la question entière.",
    "Décompose le calcul dans ta tête si le nombre est grand."
  ]
};
