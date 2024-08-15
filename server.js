import Fastify from "fastify";
import fastifyMysql from "@fastify/mysql";
import "dotenv/config";

const app = Fastify({logger: true});

app.register(fastifyMysql, {
    connectionString:process.env.DATABASE_URL,
    promise: true
});

app.get("/", async (req, res) => {
    return res.status(200).send({message:'Hello, world!'});
});

app.get('/category/getall', async (req, res) => {
    try {
        await app.mysql.query('SELECT * FROM category')
                .then( result =>  res.status(200).send(result[0]))
                .catch((error) => res.status(400).send({message: error.message}));
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

app.get('/category/getbyid/:id', async (req, res) => {
    try {
        await app.mysql.query("SELECT * FROM category WHERE categoryId=?", [req.params.id])
        .then(result => {
            if (!result[0][0]) return res.status(404).send({message: 'Category not found'});
            return res.status(200).send(result[0][0]);
        })
        .catch((error) => res.status(400).send({message: error.message}));
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

app.post('/category/create', async (req, res) => {
    try {
        await app.mysql.query("INSERT INTO category(categoryName,description) VALUES(?,?)",
        [req.body.categoryName, req.body.description]
        )
        .then(() => res.status(201).send({message: 'Category created successfully'}))
        .catch((error) => res.status(400).send({message: error.message}));

    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

try {
    const HOST = process.env.HOST;
    const PORT = process.env.PORT;
    await app.listen({port: PORT, host: HOST});
} catch (error){
    app.log.error(error);
    process.exit(1);
}