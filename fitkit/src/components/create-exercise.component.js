import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';

export default class CreatExercise extends Component {
    constructor(props) {
        super(props);

        // this.onChangeUser = this.onChangeUsername.bind(this);
        // this.onChangeDescription = this.onChangeDescription.bind(this);
        // this.onChangeDuration = this.onChangeDuration.bind(this);
        // this.onChangeDate = this.onChangeDate.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            description: '',
            duration: 0,
            date: new Date(),
            users: []  //select user to associate with your exercise
        }
    }

    componentDidMount() {

        //using axios to connect to server to GET users
        axios.get('http://localhost:5000/users/')
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username),
                        username: res.data[0].username
                    })
                }
            })
            .catch(err => console.log(`Error: ${err}`));
    }

    onChange = event => {
        const {name , value } = event.target;
        
        this.setState({
            [name] : value
        });
    }

    onSubmit = event => {
        event.preventDefault(); 

        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }

        //this is where we'll submit the info to the DB
        axios.post('http://localhost:5000/exercises/add', exercise)
            .then(res => console.log(res.data)); 

        console.log(exercise);

        //once user submits an exercise, will bring them back to list of exercises
        window.location = '/';
    }

    render() {
        const { username, description, duration, date } = this.state;
        return (
            <div>
                <h3>Create New Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label>Username:</label>
                        <select 
                            ref='UserInput'
                            required
                            className='form-control'
                            value = {username}
                            onChange={this.onChange} >
                            { //we're getting options right from our users array
                                this.state.users.map(function(user) {
                                    return <option
                                        key={user}
                                        value ={user}
                                    >
                                        {user}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Description: </label>
                        <input 
                            type='text'
                            className='form-control'
                            value={description}
                            onChange={this.onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Duration (in minutes): </label>
                        <input 
                            type='text'
                            className='form-control'
                            value={duration}
                            onChange={this.onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Date: </label>
                        <div>
                            <DatePicker
                                selected={date}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                    
                    <div className='form-group'>
                        <input
                            type='submit'
                            value='Create Exercise Log'
                            className='btn btn-primary'
                        />
                    </div>
                </form>
            </div>
        )
    }
}