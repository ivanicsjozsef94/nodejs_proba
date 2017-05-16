const express = require('express');
//handlebarsjs -> olyan, mint az angular (npm: hbs)
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials'); //hogy az ismétlődő részeket lehessen használni!
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url} ${req.ip}\n`;
    console.log(log); //metódus: pl. GET, url, a kért url.
    //req -> klienstől érkező dolgok!
    fs.appendFile('server.log', log, (err) => {
        if(err) {
            console.log(err);
        }
    });

    //next-tet kell meghívni, enélkül a futás nem fog folytatódni.
    next();
});

//Kommentezd ki, ha ezt nem akarjuk!
app.use((req, res, next) => {
    //Ha az oldal pillanatnyilag nem elérhető:
    res.render('maintenance.hbs'); //a későbbiek már nem lesznek meghívva!
});
//Ez azért kell a maintenance után, mert, ha elötte van, akkor pl a help.html-t még meg lehetne hívni!
app.use(express.static(__dirname + '/public')); //ez ahhoz kell, hogy a html-eket meg tudjuk osztani! --> app.use() -> middleware használata


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
}); //ez egy függvény lesz, amit meghívhatunk!

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});



app.get('/', (req, res) => {
    //res.send('<h1>Hello World!</h1>');
    /*res.send({
        name: 'Ivanics József',
        age: 14,
        likes : [
            'hami',
            'nyami'
        ]
    });*/
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        name: 'Ivanics József'
    });
});

app.get('/about', (req, res) => {
    //res.send('About page...');
    res.render('about.hbs', { //renderelje le ezt az oldalt
        pageTitle: 'About Page',
        //currentYear: new Date().getFullYear() ezt nem muszáj így megadni, használhatunk helyette getCurrentYeart!
    }); 
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unnable to handle this request!'
    });
})


//app.listen(3000);
app.listen(3000, () => {
    console.log('A szerver elindult!');
});