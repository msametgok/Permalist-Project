import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'permalist',
  password: 'samet',
  port: 5432
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items;

app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await pool.query(`INSERT INTO items (title) VALUES ('${item}')`)
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;
  await pool.query(`UPDATE items SET title = '${newTitle}' WHERE id = ${id}`);
  res.redirect('/');
  //UPDATE ETTIKTEN SONRA FRONTEND DE HATA VAR 
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await pool.query(`DELETE FROM items WHERE id = ${id}`)
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
