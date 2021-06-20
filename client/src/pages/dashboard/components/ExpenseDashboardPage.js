import React from 'react'
import { connect } from 'react-redux'

import ExpenseList from './ExpenseList'
import ExpenseListFilters from './ExpenseListFilters'
import { addExpense, resetExpenseReducer } from '../actions/expenses'
import { changeAuth } from '../../../actions/auth'
import { resetFilterReducer } from '../actions/filters'
import { Link } from 'react-router-dom'
import Header from './Header'




class ExpenseListDashboard extends React.Component {
    constructor(props) {
        super(props)

        if (props.auth === false) {
            props.history.push("/")
        }

        //clearing reduce expenser before filling it up from the database to avoid duplicate data
        this.props.dispatch(resetExpenseReducer())

        //calling api to get all the expenses
        const url = "http://localhost:8080/getExpenses?email=" + encodeURIComponent(props.email)
        let h = new Headers({
            "Authorization": "Bearer " + props.token
        })

        let req = new Request(url, {
            headers: h
        })

        fetch(req).then((response) => {
            response.json().then((data) => {
                //filling the expenses in the reducer one by one
                for (let i = 0; i < data.length; i++) {

                    this.props.dispatch(addExpense({ description: data[i].description, note: data[i].note, amount: parseInt(data[i].amount), createdAt: parseInt(data[i].createdAt), id: data[i].id }))


                }

            })
        })

        
    }


    
    //method called when logout button is clicked
    logout = (e) => {


        const url = "http://localhost:8080/logout?email=" + encodeURIComponent(this.props.email) + "&token=" + encodeURIComponent(this.props.token)
        let h = new Headers({
            "Authorization": "Bearer " + this.props.token
        })

        let req = new Request(url, {
            method: "POST",
            headers: h
        })

        fetch(req).then(() => {

        }).catch((error) => {
            console.log(error)

        })

        //changing auth to false, and resetting expense and filter reducers
        this.props.dispatch(changeAuth(false, undefined, undefined))
        this.props.dispatch(resetExpenseReducer())
        this.props.dispatch(resetFilterReducer())



    }



    render() {


        return (
            <div>
                <Header></Header>
                <h3>Expense List for {this.props.email}</h3>

                <Link to="/">
                    <button onClick={this.logout}>Logout</button>

                </Link>

                <ExpenseListFilters />
                <ExpenseList />
            </div>
        )



    }


}

const mapStateToProps = (state) => {

    return {
        auth: state.auth.authenticated,
        email: state.auth.email,
        token: state.auth.token
    }
}



export default connect(mapStateToProps)(ExpenseListDashboard);

