import { Component } from 'react';
import firebase from './firebase.js';
import RandomCollectiveStrategy from './RandomCollectiveStrategy.js'


class Contribute extends Component{
    constructor() {
        super();
        this.state = {
            //empty array in which collective cards will be pushed and from which a random collective card will be drawn
            strategyCollectiveArray: [],
            author: '',
            strategy: '',
            //showModal state which will change from false to true to display the alert message if strategy being submitted is empty, or a confirmation of the strategy being submitted when not empty.
            showModal: false,
        }
    }

    componentDidMount(){
        //Store the database reference in a variable
        const dbref = firebase.database().ref();

        //Obtain the data object from the Firebase using 'value' and the val() Firebase method and setState to that array
        dbref.on('value', (data) => {
            const dbResult = data.val();
            console.log(dbResult);

            //GETTING AN OBJECT - Let's turn it into an array with onl;y the information we need: The values!
            //using Object.values to get only the values :)
            const dbArray = Object.values(dbResult);
            console.log('Using values', dbArray);
            
            //SetState of the array to the array obtained by converting the firebase data object (only the values)
            this.setState({
                strategyCollectiveArray: dbArray
            })
        })
    }

    // Grab the input value of name when the user types and set the state
    authorInput = (input) => {
        this.setState ({
            author: input.target.value 
        })
    }

    // Grab the input value of strategy when the user types and set the state
    strategyInput = (input) => {
        this.setState ({
            strategy: input.target.value
        })
    }

    // Event handler to push the user input into the firebase array
    pushToFirebase = () => {
        //Make reference to the database
        const dbref = firebase.database().ref();
        // push the author and strategy as an object
        //Because the author name is optional, if the user does not enter their name, the word Anonymous will be pushed.
        dbref.push({
            author: this.state.author === '' 
                ? 'Anonymous' 
                : this.state.author,
            strategy: this.state.strategy
        });
        //clear the state - this will also clear ths input because we have binded it's value to the state
        this.setState({
            strategy: '',
            author: ''
        })
    }

    //declare a function that will change the state of showModal 
    modalToggle = (e) =>{
        e.preventDefault();
        this.setState({
            showModal: this.state.showModal === false ? true : false,
        })
    }

    
    render(){
        return(
            <section className="contribute" id="contribute">
                
                <h3>Collective Strategies</h3>

                <div className="intro wrapper">
                    
                    <div>
                        <p className="aboutIntro">If you're like me, you've often turned to your friends, family members, mentors, and even strangers on the Internet to ask for the best advice they can give you when trying to solve a problem, or overcome a challenge. The Collective Strategies deck is just that! A collection of advice, from you, and anyone who wishes to share their most valued strategy. </p>
                    
                        <p className="aboutIntro">I hope that you find this deck just as useful as the origin Oblique Strategies, and that you will be inclined to share a piece of advice. I've included some tips in order to guide this process. </p>
                    </div>
                
                    <form className="card">
                
                        <label 
                            className="srOnly" 
                            htmlFor="contributor">

                                Your name
                        </label>
                        <input 
                            type="text" 
                            id="contributor" 
                            onChange={this.authorInput} 
                            value={this.state.author} 
                            placeholder="Your name (optional)">
                        </input>

                        <label 
                            className="srOnly" 
                            htmlFor="strategy">

                                Your strategy
                        </label>
                        <textarea
                            maxLength="100" 
                            id="strategy" 
                            onChange={this.strategyInput} 
                            value={this.state.strategy} 
                            placeholder="Strategy (maximum characters 100)">
                        </textarea>


                        <button onClick={this.modalToggle}>

                                Add strategy to deck
                        </button>

                    </form>
                
                    <article>

                        <h4>Tips on contributing a Collective Strategy</h4>

                        <div className="tips">
                            <h4>1. Contribute kindly |</h4>

                            <p>Our goal is to create a high impact deck that many can enjoy. Let's provide advice in an inclusive manner by using  that is free from words, phrases or tones that reflect prejudiced, stereotyped or discriminatory views of particular people or groups.</p>
                        </div>
            
                        <div className="tips">
                            <h4>2. Be a generalist |</h4>

                            <p>Oblique Strategies are know for having a neutral and general tone that can apply to a large number of situations. They can be relatable to anyone who picks them up, without having to know who the author is. Let's make our Collective deck just as accesible.</p>
                        </div>

                        <div className="tips">
                            <h4>3. Avoid acronyms and jargon |</h4>
                    
                            <p>Writing in full words with clear and concise vocabulary will prevent fellow strategists from having to overthink the meaning of your strategy. And that's the goal!</p>
                        </div>

            
                    </article>
                
                </div>
                
                {/* EXPRESSION TO DISPLAY THE CORRECT MODAL aka is this.state.strategy === empty, display the error modal, else, display the confirm modal*/}
                {this.state.showModal === true 
                    ? < Modal 
                        strategy={this.state.strategy}
                        toggle={this.modalToggle}
                        pushToFirebase={this.pushToFirebase}/>
                    : null}
                
                < RandomCollectiveStrategy 
                    array={this.state.strategyCollectiveArray}/> 

            </section>
        )
    }
}

class Modal extends Component {
    render() {
        return (

            <div>
            {/* Show the correct modal based on the tstate(props) of the strategy aka, if its empty, lets show the error modal, if its not empty, lets show the confirm modal */}
            {
                this.props.strategy === ''
                    ? < Error 
                        toggle={this.props.toggle}/>
            
                    : < Confirm 
                        strategy={this.props.strategy}
                        pushToFirebase={this.props.pushToFirebase}
                        toggle={this.props.toggle}/> 
            }
            
            </div>
        );
        
    }
}

//Error message for when the user has not entered any text in the strategy but clicks the button
class Error extends Component {
    //clickHandle to close the modal

    render() {
        return (
            <div>
                <p>Oops! You cannot contribute an empty strategy.</p>

                <button 
                //  Click handler - function to setState for showModal of App - passed to to chil as props
                    onClick={this.props.toggle}>
                        
                        Okay
                </button>

            </div>
        );
    }
}

//Confirmation message for when the user to mkae sure that they are contributing the right thing
class Confirm extends Component {

    render() {
        return (
            <div>
                <p>You're about to submit this strategy: {this.props.strategy}.</p>
                <button 
                    // Click handler - function to setState for showModal of App - passed to to chil as props
                    onClick={this.props.toggle}>
                        
                        Not Quite
                </button>

                <button
                //Click handler to push to user strategy to Firebase - push function passed to child as props
                    onClick={this.props.pushToFirebase}>
                        
                        Okay
                </button>

                
            </div>
        );
    }
}



export default Contribute;


//Syl
//Dumb it down to make it more complicated.
//What must stay? Get rid of the rest. 
//Listen to your favourite song. 
//Call a friend, but talk about something else.
//Check on your plants.





