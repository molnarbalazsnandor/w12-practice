const express = require("express");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

const app = express();

app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.use(
  "/public",
  express.static(path.join(`${__dirname}/../frontend/public`))
);

app.get("/images", (req, res) => {
  fs.readFile("images.json", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.json(JSON.parse(data));
    }
  });
});

app.post("/upload-image", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const newImage = req.files.image;
  const newImageData = {
    url: newImage.name,
    title: req.body.title,
    uploadDate: "2022-11-15",
    phName: req.body.phname,
  };

  newImage.mv(
    `${__dirname}/../frontend/public/images/${newImage.name}`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  fs.readFile("images.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let imagesData = JSON.parse(data);
      imagesData.push(newImageData);

      fs.writeFile(
        "images.json",
        JSON.stringify(imagesData, null, 4),
        (error) => {
          if (error) {
            console.log(error);
          } else {
            return res.json(newImageData);
          }
        }
      );
    }
  });
});

app.listen(9000, (_) => console.log("http://127.0.0.1:9000"));
