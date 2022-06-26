import * as fsp from "fs/promises";

import express from "express";
import { writeFile } from "fs";
import { stringify } from "querystring";

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

// get all products
app.get("/products", (req, res) => {
  fsp.readFile("./products.json", "utf8").then((data) => {
    const json = JSON.parse(data);
    res.send(json);
  });
});

// get product by id
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

// post new product
app.use(express.json());
app.post("/products", (req, res) => {
  console.log(req.body);
  fsp.readFile("./products.json", "utf8").then((data) => {
    const jsonArray = JSON.parse(data);

    jsonArray.push({
      id: getMaxId(jsonArray) + 1,
      title: req.body.title,
      completed: false,
    });
    fsp.writeFile("./products.json", JSON.stringify(jsonArray)).then(() => {
      res.send(jsonArray);
    });
  });
});

// update product by id
app.patch("/products/:id", (req, res) => {
  const { id } = req.params;
  fsp.readFile("./products.json", "utf8").then((data) => {
    if (req.body) {
      const product = JSON.parse(data);
      const productIndex = product.findIndex((obj) => obj.id === +id);
      product[productIndex] = { ...product[productIndex], ...req.body };
      fsp
        .writeFile("./products.json", JSON.stringify(product))
        .then(() => {
          res.send(product);
        })
        .catch((err) => console.log(error));
    }
  });
});

// delete product by id
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  fsp.readFile("./products.json", "utf8").then((data) => {
    const product = JSON.parse(data);
    const productIndex = product.findIndex((obj) => obj.id === +id);
    if (productIndex >= 0) {
      product.splice(productIndex, 1);
      fsp
        .writeFile("./products.json", JSON.stringify(product))
        .then(() => {
          res.send(product);
        })
        .catch((err) => console.log(error));
    } else {
      res.send(product);
    }
  });
});

// get product by title
app.get("/products", (req, res) => {
  fsp.readFile("./products.json", "utf8").then((data) => {
    const products = JSON.parse(data);
    if (req.query) {
      const { title } = req.query;
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(filteredProducts);
    }
    res.send(products);
  });
});

app.listen(8000);
