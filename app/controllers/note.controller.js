const Note = require('../models/note.model')

// create new note
exports.create = (req, res) => {
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note can't be empty"
        })
    }

    const note = new Note({
        title: req.body.title || "Untitled note",
        content: req.body.content
    })

    note.save()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send(err.message.json())
        })
}

// get all notes
exports.findAll = (req, res) => {
    Note.find()
        .then(notes => {
            res.send(notes)
        })
        .catch(err => {
            res.status(500).send(err.message.json())
        })
}

// find a note with Id
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found"
                })
            }

            res.send(note)
        })
        .catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.noteId}`
                })
            }
            return res.status(500).send({
                message: `Error retrieving while note. NoteId: ${req.params.noteId}, ${err.message}`
            })
        })
}

// update a note identified by the noteId
exports.update = (req, res) => {
    if(!req.body.content) {
        return res.status(400).send({
            message: `Note content cannot be empty`
        })
    }

    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled note",
        content: req.body.content
    }, {new: true})
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: `Note not found with Id: ${req.params.noteId}`
                })
            }
            res.send(note)
        })
        .catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.noteId}`
                })
            }
            return res.status(500).send({
                message: `Error retrieving while note. NoteId: ${req.params.noteId}, ${err.message}`
            })
        })
}

// delete a note with the specified noteId
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({
                message: `Note deleted succ!`
            })
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        })
}