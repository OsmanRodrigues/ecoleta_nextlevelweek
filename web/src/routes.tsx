import React from 'react';
import{Route, BrowserRouter, Switch} from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const Routes =()=>{

    return(
        <BrowserRouter>
            <Switch>
                <Route component={Home} exact path='/' />
                <Route component={CreatePoint} exact path='/create-point' />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes