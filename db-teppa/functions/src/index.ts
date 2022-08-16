import * as functions from "firebase-functions";
import express, {Request, Response} from "express";
import admin from "firebase-admin";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
admin.initializeApp();


const db = admin.firestore().collection("todoList");

app.get("/todo", (req:Request, res:Response) => {
  db.get().then((docs) => {
    const todos:object[] = [];
    docs.forEach((doc) => {
      todos.push({id: doc.id, description: doc.data().description});
    });

    res.send(todos);
  });
});

app.post("/todo", async (req:Request, res:Response) => {
  const newTodo = {
    description: req.body.description};

  await db.add(newTodo).then(() => {
    res.send("Tarefa adicionada!");
  });
});

app.put("/todo/:id", async (req:Request, res:Response) => {
  const id = req.params.id;
  const newDescription = {description: req.body.description};

  await db.doc(id).update(newDescription);

  res.send("Tarefa alterada com sucesso!");
});

app.delete("/todo/:id", async (req:Request, res:Response) => {
  const id = req.params.id;

  await db.doc(id).delete();

  res.send("Tarefa deletada com sucesso!");
});

exports.api = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
