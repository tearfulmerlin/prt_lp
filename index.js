const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8000;

const botToken = process.env.BOT_TOKEN;
const sendMessageBot = async(data) => axios.post(
    `https://api.telegram.org/${botToken}/sendMessage`, {
        chat_id: -1001321397381,
        parse_mode: 'Markdown',
        text: `
          *Нова заявка*

          Ім'я:
          ${data.name}
          
          Телефон:
          ${data.phone}
        `,
    }
);


app.use(bodyParser.json({ limit: '0.5mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '0.5mb', extended: false, parameterLimit: 50000 }))
app.use(compression());
app.use(express.static('public'));
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`)
  } else {
    next();
  }
});

app.post('/lead', function(req, res) {
    sendMessageBot(req.body)
        .then((tgResponce) => {
            res.json({ staus: 'ok', ...tgResponce.data });
        }).catch((err) => {
            res.json({ staus: 'error' })
        });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})