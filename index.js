const express = require('express');
const sslRedirect = require('heroku-ssl-redirect').default;
const bodyParser = require('body-parser');
const compression = require('compression');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8000;

const botToken = process.env.BOT_TOKEN;
const chat_id = process.env.CHAT_ID;
const sendMessageBot = async(data) => axios.post(
    `https://api.telegram.org/${botToken}/sendMessage`, {
        chat_id,
        parse_mode: 'Markdown',
        text: `
          *Нова заявка*
          
          source:
          ${data.source}

          Ім'я:
          ${data.name}
          
          Телефон:
          ${data.phone}
        `,
    }
);

app.use(sslRedirect(['production'], 301));
app.use(bodyParser.json({ limit: '0.5mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '0.5mb', extended: false, parameterLimit: 50000 }))
app.use(express.static('public', {
  maxAge: '432000000',
}));
app.use(compression());

app.post('/lead', function(req, res) {
    sendMessageBot(req.body)
        .then((tgResponse) => {
            res.json({ message: 'success', tgResponse });
        }).catch((err) => {
            res.status(err.response.status).json({ staus: 'error', err })
        });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
