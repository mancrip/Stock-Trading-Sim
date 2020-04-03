const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/tables", async (req, res) => {
    let adminId = req.session.adminId;
    if (!adminId) {
        res.sendStatus(401);
        return;
    }
    database.query("SELECT table_name FROM INFORMATION_SCHEMA.TABLES where table_schema = 'stocktradingsim' order by table_name", [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);

            }
        )
});

router.get("/tables/:tableName", (req, res) => {
    let tableName = req.params.tableName;
    let adminId = req.session.adminId;
    if (!adminId) {
        res.sendStatus(401);
        return;
    }
    database.query(`SELECT * from ${tableName}`, [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                console.log(error)
                res.sendStatus(500);

            }
        )
});

module.exports = router;