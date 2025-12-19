# Strat-SAE-301-303/Groupe 3 - Documentation administrateur
## 1. Présentation 

MasterClass est une application web développée dans le but de présenter de façon originale et novatrice les données concerant les Masters. 
L’objectif est de rendre la recherche d’informations plus simple et dynamique de manière à ce que la comparaison entre les différentes formations soit plus facile. 
Cette application web ciblera en particulier les étudiants de licence qui souhaitent poursuivre leurs études. 
Pour chaque offre de Master, on retrouvera : des indicateurs visuels (originaux et dynamiques), des ouvertures vers d’autres offres ainsi que d’autres informations que l’on considérera pertinentes pour l’utilisateur.
Afin de mettre en place ce projet, nous disposerons de données sources de bases qui sont : 2 jeux de données open source issues de data.gouv.fr et une API REST ouverte à l’exploitation de ces données.  
L’idée est d’également prendre en compte les enjeux d'accessibilité pour garantir l’inclusivité pour tous.

## 2. Présentation technique

Pour notre application, nous utilisons plusieurs languages qui sont : HTML, CSS, Javascript (pour la visualisation des données). Le Javascript permettra de générer nos visualisations, choisies à partir des précédents entretiens. Nos visualisations sont les suivantes : un modèle en camembert, un histogramme et une carte intéractive. Nous utiliserons le site https://echarts.apache.org pour leur design et leur interactivité. 

### Arborescence et description des fichiers

Le projet est organisé de la manière suivante :
```
.
├── accueil.html
├── explorer.html
├── formation.html
├── info.html
├── README.md
├── base-de-donnee/
│   └── fr-esr-mon_master.json
├── css/
│   └── style.css
├── images/
│   └── svg/
└── scripts/
    ├── camembert.js
    ├── carteinteractive.js
    ├── explorer.js
    ├── histogramme.js
    ├── orchestrator.js
    └── recupdedonne.js
```

-   **`accueil.html`**: La page d'accueil de l'application.
-   **`explorer.html`**: La page principale pour l'exploration et la visualisation des données.
-   **`formation.html`**: Une page détaillant les informations sur une formation spécifique.
-   **`info.html`**: Une page d'information ("à propos").
-   **`css/style.css`**: La feuille de style principale.
-   **`scripts/`**: Contient tous les scripts JavaScript.
    -   **`recupdedonne.js`**: Gère la récupération des données depuis le fichier JSON.
    -   **`orchestrator.js`**: Coordonne les différents modules JavaScript.
    -   **`camembert.js`**, **`histogramme.js`**, **`carteinteractive.js`**: Contiennent le code pour générer chaque visualisation.
    -   **`explorer.js`**: Gère la logique de la page `explorer.html`.
-   **`base-de-donnee/`**: Contient le jeu de données `fr-esr-mon_master.json`.
-   **`images/`**: Contient les icônes SVG utilisées dans l'interface.

## 3. Guide de déploiement 

Toutes les données sont récupérées via des appels HTTP GET vers les sources ouvertes (API ou fichiers JSON).
Pour lancer le prototype de l'application, suivez ce guide par étapes : 
### Prérequis 
- Vous disposez d'un navigateur tel que Chrome, Edge, Firefox ou tout autre navigateur moderne.
- Vous disposez d'un server local : nous recommendons par exemple de lancer notre application via Live Server sur VS Code.
### Lancer le prototype de l'application 
#### 1. Télécharger le projet via GitHub
#### 2. Ouvrir le dossier du projet dans un éditeur (nous recommandons VS Code)
#### 3. Lancer l'application en cliquant sur Live Server (clic droit : "Open via Live Server")
#### 4. Accéder à l'application dans le navigateur de votre choix

---
*Ce projet a été réalisé par le Groupe 3: Houssein, Klervi, Victor, Mairwen, Océane*
