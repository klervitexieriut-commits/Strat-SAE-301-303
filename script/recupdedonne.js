fetch('https://exemple.com/api/data')
  .then(response => response.json())
  .then(data => {
    console.log('Réponse API :', data);
  })
  .catch(error => {
    console.error('Erreur :', error);
  });
