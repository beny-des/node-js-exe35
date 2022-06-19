import * as fsp from "fs/promises";
import http from "http";

function readMyFile(filename) {
  fsp.readFile(filename, "utf8")
  .then((word) => {
    fsp.readFile("./translation.json")
      .then((words) => {
        const json = JSON.parse(words);
        const exist = json.find((animal) => animal.en === word);
        if (exist) {
          fsp.writeFile("./he.txt", exist.he);
        }
      })
      .catch((err) => console.log(err));
  });
}


http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });

    readMyFile("./en.txt");
    response.end("translation Succeeded\n");
  })
  .listen(8000);

console.log("Server running at http://127.0.0.1:8000/");

