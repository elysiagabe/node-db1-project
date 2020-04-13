const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router();

// === ENDPOINTS === //
// GET all accounts
router.get('/', (req, res) => {
    const limit = req.query.limit || undefined;
    const sortby = req.query.sortby || 'id';
    const sortdir = req.query.sortdir || 'asc';

    db.select('*')
      .from('accounts')
      .limit(limit)
      .orderBy(sortby, sortdir)
      .then(accounts => {
          res.status(200).json(accounts)
      })
      .catch(error => {
          res.status(500).json({ error: error.message })
      })
})

// GET specific account by ID
router.get('/:id', (req, res) => {
    db('accounts').where({ id: req.params.id })
    .then(account => {
        res.status(200).json({ data: account })
    })
    .catch(error => {
        res.status(500).json({ error: error.message })
    })
})

// POST/create new account
router.post('/', (req, res) => {
    const newAcct = req.body;
    db('accounts')
        .insert(newAcct, "id")
        .then(ids => {
            const id = ids[0];
            db('accounts')
                .where({ id })
                .first()
                .then(acct => {
                    res.status(201).json({ data: acct })
                })
        })
        .catch(error => {
            res.status(500).json({ error: error.message })
        })
})

// PATCH/update existing account
router.patch('/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;

    db('accounts')
        .where({ id })
        .update(changes)
        .then(count => {
            if(count > 0) {
                res.status(200).json({ message: "Account updated successfully." })
            } else {
                res.status(404).json({ message: "Account could not be updated. No accounts matching specified ID." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message })
        })
})

// DELETE existing account
router.delete('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            if(count > 0) {
                res.status(200).json({ message: "Account deleted successfully. " })
            } else {
                res.status(404).json({ message: "Account with specified id does not exist." })
            }
            
        })
        .catch(error => {
            res.status(500).json({ error: error.message })
        })

})

module.exports = router;