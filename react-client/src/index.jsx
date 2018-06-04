import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import HappyHourList from './components/happyHourList.jsx';
import HappyHourHeader from './components/header.jsx';
import LoginPage from './components/loginPage.jsx';
import CreateUserPage from './components/createUserPage.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      password: '',
      loginPage: false,
      // ^^^ make true to work on login page ^^^
      createUserPage: false,
      // ^^^ make true to work on create user page ^^^
      location: 'loading..',
      date: 'loading..',
      items: [{ description: 'Happy Hour 1' }],
    };
    this.typeUserEmail = this.typeUserEmail.bind(this);
    this.typePassword = this.typePassword.bind(this);
    this.handleCreateUserClick = this.handleCreateUserClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLoginPageClick = this.handleLoginPageClick.bind(this);
    this.handleSignUpPageClick = this.handleSignUpPageClick.bind(this);
    this.handleHomePageClick = this.handleHomePageClick.bind(this);
  }

  // after the component mounts
  componentDidMount() {
    // get current location and time
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyDFYgdEUy4CeS5XcKc2G7w3pWjQ7f946DA`)
          .then((res) => {
            console.log(res.data.results);
            this.setState({
              location: `${res.data.results[0].address_components[2].long_name}, ${res.data.results[0].address_components[3].long_name}`,
            });
          })
          .catch(err => console.log(err));
        const date = new Date(position.timestamp);
        this.setState({
          date: date.toString().substring(0, 16),
        });
      },
      (err) => { console.log(err); },
    );
    // populate happy Hour list with get request.
    // axios.get('/happyHours').then((data) => {
    //   this.setState({
    //     items: data,
    //   });
    // }).catch((err) => {
    //   console.log('err', err);
    // });
  }
  // on change event for user email input (Login Page)
  typeUserEmail(event) {
    this.setState({ userEmail: event.target.value });
  }
  // on change event for password input (Login Page)
  typePassword(event) {
    this.setState({ password: event.target.value });
  }
  // on click for login page redirect to signup page
  handleCreateUserClick() {
    console.log('REDIRECT CREATE USER PAGE');
    this.setState({
      createUserPage: true,
      loginPage: false,
    });
  }

  // on click for create user page redirect to login page
  handleLoginClick() {
    console.log('REDIRECT LOGIN PAGE');
    this.setState({
      createUserPage: false,
      loginPage: true,
    });
  }

  handleLoginPageClick() {
    this.setState({
      loginPage: true,
    });
  }


  handleSignUpPageClick() {
    this.setState({
      createUserPage: true,
    });
  }

  handleHomePageClick() {
    this.setState({
      createUserPage: false,
      loginPage: false,
    });
  }

  render() {
    if (this.state.createUserPage) {
      return (
        <div>
          <div> Create User Page </div>
          <CreateUserPage handleHomePageClick={this.handleHomePageClick} handleLoginClick={this.handleLoginClick} userEmail={this.state.userEmail} password={this.state.password} pwchange={this.typePassword} usrchange={this.typeUserEmail} />
        </div>
      );
    }
    if (this.state.loginPage) {
      return (
        <div>
          <LoginPage handleHomePageClick={this.handleHomePageClick} handleCreateUserClick={this.handleCreateUserClick} userEmail={this.state.userEmail} password={this.state.password} pwchange={this.typePassword} usrchange={this.typeUserEmail} />
        </div>
      );
    }
    return (
      <div>
        <HappyHourHeader location={this.state.location} date={this.state.date} />
        <br />
        <button onClick={this.handleSignUpPageClick}>Sign Up</button>
        <button onClick={this.handleLoginPageClick}>Login</button>
        <h1>Happy Hour List</h1>
        <HappyHourList items={this.state.items} />
      </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
