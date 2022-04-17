const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// serve static assets normally
app.use(express.static(__dirname + '/build'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  const indexPath = path.resolve(__dirname, 'build/index.html')
  response.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
