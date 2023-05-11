const express = require('express');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 5001;

const botToken = process.env.BOT_TOKEN;
const chat_id = process.env.CHAT_ID;
const sendMessageBot = async(data) => axios.post(
    `https://api.telegram.org/${botToken}/sendMessage`, {
        chat_id,
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
app.use(express.json({ limit: '0.5mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '0.5mb', extended: false, parameterLimit: 50000 }))

app.post('/lead', function(req, res) {
    sendMessageBot(req.body)
        .then((tgResponce) => {
            res.json({ message: 'success' });
        }).catch((err) => {
        res.status(err.response.status).json({ staus: 'error' })
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
