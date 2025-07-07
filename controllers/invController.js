const db = require("../db/queries");

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// TO DO
async function invListGet(req, res) {
    const games = await db.getAllFromTable('games');
    const genres = await db.getAllFromTable('genres');
    const developers = await db.getAllFromTable('developers');
    //console.log("Games: ", games , "Genres: ", genres, "Developers: ", developers);
    
    const formattedGames = games.map(game => ({
        ...game,
        formattedDate: formatDate(game.release_date)
    }));

    res.render("index", {
        title: "Game Spot",
        listTitle: "All Games Currently Recorded",
        games: formattedGames,
        genres: genres,
        developers: developers //("Studio: " + developers.map(dev => dev.name).join(", "))
    })
};

async function invManageGet(req,res) {
    res.render("manage", {
        title: "Manage Game Database",
    });
}

async function invNewItemPost(req,res) {
    const table = req.params.table
    const content = req.body;
    await db.insertItem(table,content)
    res.redirect("/");
}

async function invUpdateItemGet(req,res) {
    const name = req.params.table;
    const table = await db.getItemFromTable(req.params.table ,req.params.id);
    console.log( table );
    res.render("update", {
        title: "Update " + name,
        table: table,
        tableName: name
    })
}

async function invUpdateItemPost(req,res) {
    const table = req.params.table;
    const content = req.body;
    await db.updateItem(table, req.params.id, content);
    res.redirect("/");
}

async function invDeleteItemPost(req,res) {
    const table = req.params.table;
    await db.deleteItemPost(table,req.params.id);
    res.redirect("/");
}

module.exports = {
    invListGet,
    invManageGet,
    invNewItemPost,
    invUpdateItemGet,
    invUpdateItemPost,
    invDeleteItemPost
}