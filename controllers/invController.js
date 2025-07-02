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
    console.log("Games: ", games , "Genres: ", genres, "Developers: ", developers);
    
    const formattedGames = games.map(game => ({
        ...game,
        formattedDate: formatDate(game.release_date)
    }));

    res.render("index", {
        title: "Game Spot",
        listTitle: "All Games Currently Recorded",
        games: formattedGames,
        genres: ("Genres: " + genres.map(genre => genre.name).join(", ")),
        developers: ("Studio: " + developers.map(dev => dev.name).join(", ")),
        founded: ("Founded: " + developers.map(dev => dev.founded_year).join(", ")),
    })
};

async function invManageGet(req,res) {
    res.render("manage", {
        title: "Manage Game Database",
    });
}

async function invNewGamePost(req,res) {
    const content = req.body;
    await db.insertGame(content.gameTitle, content.releaseDate)
    res.redirect("/");
}

async function invNewGenrePost(req,res) {
    const content = req.body;
    await db.insertGenre(content.genre, content.genreDesc)
    res.redirect("/");
}

async function invNewDevPost(req,res) {
    const content = req.body;
    await db.insertDeveloper(content.studio, content.founded)
    res.redirect("/");
}

async function invUpdateItemGet(req,res) {
    const game = await db.getItemFromTable("games",req.params.id);
    console.log( game );
    res.render("update", {
        title: "Update Item",
        game: game
    })
}

async function invUpdateGamePost(req,res) {
    const {gameTitle, releaseDate} = req.body;
    await db.postUpdateGame(req.params.id, gameTitle,releaseDate);
    res.redirect("/");
}
async function invUpdateGenrePost(req,res) {
    
}
async function invUpdateDevPost(req,res) {
    
}
async function invDeleteGamePost(req,res) {
    await db.postDeleteGame(req.params.id);
    res.redirect("/");
}

module.exports = {
    invListGet,
    invManageGet,
    invNewGamePost,
    invNewGenrePost,
    invNewDevPost,
    invUpdateItemGet,
    invUpdateGamePost,
    invUpdateGenrePost,
    invUpdateDevPost,
    invDeleteGamePost
}