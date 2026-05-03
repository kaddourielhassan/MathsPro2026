# MathsPro 2026 — Cadre de Projet Pédagogique

## 1. Vision et Objectifs
MathsPro est une application web conçue pour le **Lycée Professionnel Alfred Sauvy**. Elle vise à renforcer les automatismes en calcul mental et à combler les lacunes sur les fondamentaux du Cycle 4.

**Objectifs principaux :**
- **Autonomie** : Permettre aux élèves de s'entraîner à leur rythme.
- **Validation** : Certifier l'acquisition de compétences via des tests chronométrés.
- **Inclusion** : Proposer une interface accessible (Mode Dyslexie, Mode Sombre).

## 2. Architecture et Souveraineté des Données
- **100% Offline** : L'application ne nécessite aucune connexion internet après le chargement initial.
- **Zustand Persistence** : Les profils et l'historique sont stockés exclusivement dans le `localStorage` du navigateur de la machine locale.
- **Risque de Maintenance** : Attention ! Le nettoyage manuel du cache ou des données de site par les services techniques supprimera l'intégralité des données élèves sur le poste concerné.
- **Confidentialité** : Aucun tracking, aucune donnée n'est transmise à des serveurs tiers.

## 3. Gouvernance et Sécurité (Livrable 3)
Pour garantir l'intégrité pédagogique et la pérennité de l'outil en salle informatique, les règles de gestion suivantes sont appliquées :

### Contrôle Administrateur (Code Maître 6 chiffres)
L'accès à l'Espace Enseignant est protégé par un code maître initialisé au premier lancement. Ce code est requis pour :
- **Suppression de profils** : Seul l'enseignant ou l'AED peut supprimer un compte élève pour éviter les malveillances entre pairs.
- **Réinitialisation de PIN** : Si un élève oublie son code, l'administrateur peut le réinitialiser.
- **Purge globale** : Nettoyage de la base de données locale en fin de cycle ou d'année.

### Protection Élève (PIN 4 chiffres)
L'élève peut optionnellement protéger son profil par un PIN. Ce code est demandé pour :
- **Générer l'attestation** : Garantir que seul l'élève peut exporter son bilan personnel depuis son tableau de bord.

### Structuration par Classe
L'application impose une sélection parmi une liste fermée de classes définies par l'établissement (`src/data/classes.js`), facilitant le filtrage et l'export des résultats par les enseignants.

## 4. Hiérarchie de Scoring
Les résultats sont évalués selon quatre seuils :
- **Expert** (≥ 80%) : Maîtrise totale.
- **Validé** (60-79%) : Compétence acquise (seuil minimal pour badge).
- **Fragile** (40-59%) : Consolidation nécessaire.
- **Non acquis** (< 40%) : Bases à reprendre.

---
*Projet développé par M. EL KADDOURI — Lycée Alfred Sauvy — 2026*
