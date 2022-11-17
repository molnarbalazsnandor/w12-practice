const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/script.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        //jelentése: ha a webpack .css-re végződő fájlnévvel találkozik, akkor a style és css loadert fogja használni
      },
    ],
  },
};
