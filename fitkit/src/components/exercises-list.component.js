import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class ExerciseList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exercises: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:5000/exercises')
            .then( res => {
                this.setState({
                    exercises: res.data
                });
            })
            .catch(err => console.log(`Error: ${err}`));
    }

    deleteExercise(id) {
        axios.delete('http://localhost:5000/exercises/'+ id)
            .then(res => console.log(res.data));  //will log that exercise was deleted
        this.setState({ //want to delete exercise from the table also. filter will return all the ids that arent equal to the id we're deleting (_id is created by MongoDB)
            exercises: this.state.exercises.filter( element => element._id !== id)
        })
    }

    exerciseList() {
        return this.state.exercises.map(currentExercise => {
            return <Exercise exercise={currentExercise} deleteExercise={this.deleteExercise} key={currentExercise._id} />;
        })
    }

    render() {
        return (
            <div>
                <h3>Logged Exercises</h3>
                <table className='table'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Username</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        { this.exerciseList() }
                    </tbody>
                </table>
            </div>
        )
    }
}