const express = require('express');
const Student = require('./models/Student');


const app = express();

// middleware 
app.use(express.json());

// Routes

// Get all the students
app.get('/students', async (req, res) => {
    try {
        const allStudents = await Student.find({isDeleted: false});
        if(!allStudents) return res.status(404).json(404);
        return res.json(allStudents);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

// Add student to database
app.post('/students', async (req, res) =>{
    const student = new Student({
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        class: req.body.class,
        grade_point: req.body.grade_point,
    })

    try{
        const newSavedStudent = await student.save();
        return res.json(newSavedStudent);
    }catch(error){
        return res.status(500).json(error.message);
    }
})

// Get specific student
app.get('/students/:id', async (req, res) =>{
    try {
        const allStudents = await Student.findOne({_id: req.params.id, isDeleted: false});
        if(allStudents === null) return res.sendStatus(404);
        return res.json(allStudents);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

// delete specific student
app.delete('/students/:id', async (req, res) =>{
    if(req.query.type && req.query.type === 'hard'){
        try {
            const removedStudent = await Student.deleteOne({_id: req.params.id});
            if(removedStudent.deletedCount === 1)
                return res.json(removedStudent);
            else
                return res.sendStatus(404);
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    } else{
        try {
            const removedStudent = await Student.updateOne({_id: req.params.id}, {isDeleted: true});
            return res.json(removedStudent);
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}) 


module.exports = app;
