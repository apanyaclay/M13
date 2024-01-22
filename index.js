import express from 'express';
import Supplier from './models/supplier.js';
import UserController from './controllers/user.js';
import session from 'express-session';

const app = express();
const hostname = '172.17.5.3';
const port = 3002;

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');


app.use(session({
        secret: 'ini adalah kode secret###', 
        resave: false, 
        saveUninitialized: true, 
        cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
    })
);

app.get("/login", UserController.login);
app.get("/logout", UserController.logout);
app.post("/login", UserController.auth);

app.get('/', (req, res) => {
    Supplier.findAll().then((results) => {
        res.render('index', { suppliers: results, user:req.session.user||""  });
    });
})

app.get('/create-supplier', (req, res) => {
    res.render('create');
})

app.get('/edit-supplier/:id', (req, res) => {
    Supplier.findOne({ where: { id: req.params.id } }
    ).then((results) => {
        res.render('edit', { supplier: results });
    })
})

app.post('/api/suppliers', (req, res) => {
    Supplier.create({ company_name: req.body.company_name, contact_name: req.body.contact_name, email: req.body.email, phone: req.body.phone, active: req.body.active, createdBy: req.session.user.username }
    ).then((results) => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

app.put('/api/supplier/:id', (req, res) => {
    Supplier.update({ company_name: req.body.company_name, contact_name: req.body.contact_name, email: req.body.email, phone: req.body.phone, active: req.body.active, updatedBy: req.session.user.username }, { where: { id: req.params.id } }
    ).then((results) => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

app.delete('/api/supplier/:id', (req, res) => {
    Supplier.destroy({ where: { id: req.params.id } }
    ).then(() => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 500, error: err, Response: {} });
    })
})

app.listen(port, () => {
    console.log(`Server running at ${hostname}:${port}`);
})