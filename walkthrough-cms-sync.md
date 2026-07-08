# Walkthrough - Synchronisation Admin & CMS dynamique

## 1. Vérification de la page d'accueil

1. Ouvrir l'application sur http://localhost:5173/
2. Vérifier que le hero affiche bien le prix du pack, par exemple "Deux livres pour le prix de 2000 DA".
3. Vérifier que la section "Contenu des livres" affiche uniquement les deux livres individuels.
4. Vérifier que la section "Aperçu des livres" affiche uniquement deux albums.

## 2. Vérification de l'administration

1. Ouvrir http://localhost:5173/admin
2. Se rendre dans la section "Contenu du Site"
3. Vérifier que les FAQs, avantages et témoignages par défaut sont visibles.
4. Tester la modification d'un élément, puis vérifier que la modification s'affiche immédiatement sur la page d'accueil.

## 3. Vérification technique

- Lancer la compilation frontend : `npm --prefix frontend run build`
- Vérifier que le serveur de développement tourne bien sur le port 5173.
