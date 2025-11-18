fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/')
  .then(response => response.json())
  .then(data => {

  })
  .catch(error => {
    console.error('Erreur :', error);
  });


