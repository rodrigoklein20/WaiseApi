const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '5550mb' }));

app.post('/upload', async (req, res) => {
  try { 
    
    const fileData = req.body.file;
    const fileName = req.body.fileName;
    const index = req.body.pineconeIndex;
    console.log(`Arquivo recebido: ${fileName}`)
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Salva o arquivo em disco
    const filePath = `./uploads/${fileName}`;
    fs.writeFileSync(filePath, Buffer.from(fileData, 'base64'));

    // Envia o arquivo para a API
    const form = new FormData();
    form.append('files', fs.createReadStream(filePath));
    form.append('pineconeIndex', index);

    const options = {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`
      }
    };

    const response = await axios.post('https://flow.tnsr.com.br/api/v1/vector/upsert/176d2fdb-2f61-4409-aa6c-fda93af2809d', form, options);
    console.log(fileName + ' ' + response.data);
    res.status(200).send(response.data);
    // res.status(200).send("sucesso");
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
