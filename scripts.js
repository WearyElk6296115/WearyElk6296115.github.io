// Example: Fetch live signals from your server (replace URL with your API)
const signalsContainer = document.getElementById('signals-container');

if (signalsContainer) {
  fetch('https://your-server.com/api/signals')
    .then(res => res.json())
    .then(data => {
      signalsContainer.innerHTML = data.map(signal => `
        <div class="card">
          <h3>${signal.pair}</h3>
          <p>${signal.action} at ${signal.entry} | TP ${signal.target} | SL ${signal.stop}</p>
        </div>
      `).join('');
    })
    .catch(err => {
      signalsContainer.innerHTML = '<p>Unable to load signals at this time.</p>';
      console.error(err);
    });
}
