import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Patient from './Patient';
import Doctor from './Doctor';

const App = ()=>{
  return(
    
    <Router>
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/patient/:UUID" component={Patient} />
        <Route path="/doctor/:UUID" component={Doctor} />
        <Route path="/" component={SignIn} />
      </Switch>
    </Router>
    
  );
}
export default App;