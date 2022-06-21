import * as fsp from "fs/promises";

import express from "express";

// function readMyFile(filename) {
//   fsp.readFile(filename, "utf8")
//   .then((word) => {
//     fsp.readFile("./translation.json")
//       .then((words) => {
//         const json = JSON.parse(words);
//         const result = json.find((animal) => animal.en === word);

//           fsp.writeFile("./he.txt", result.he);

//       })
//       .catch((err) => console.log(err));
//   });
// }
//  readMyFile("./en.txt");

// http.createServer((request, response) => {
//     response.writeHead(200, { "Content-Type": "text/plain" });

//     response.end("translation Succeeded\n");
//   })
//   .listen(8000);
// console.log("Server running at http://127.0.0.1:8000/");

const app = express();

function getMaxId(arr) {
  const ids = arr.map((Object) => {
    return Object.id;
  });
  const max = Math.max(...ids);
  return max;
}

app.get("/products", (req, res) => {
  fsp.readFile("./products.json", "utf8").then((data) => {
    const json = JSON.parse(data);
    res.send(json);
  });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  fsp.readFile("./products.json", "utf8").then((data) => {
    const json = JSON.parse(data);

    const product = json.find((item) => item.id === +id);
    if (product) {
      res.send(product);
    } else {
      res.send("erorr typeo");
    }
  });
});

app.use(express.json());
app.post("/products", (req, res) => {
  console.log(req.body);
  fsp.readFile("./products.json", "utf8").then((data) => {
    const jsonArray = JSON.parse(data);
    console.log(jsonArray);
    jsonArray.push({
      id: getMaxId(jsonArray) + 1,
      title: req.body.title,
      completed: false,
    });
    res.send(jsonArray);
  });
});

app.listen(8000);
