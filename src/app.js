import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'bulma'
import './styles/style.scss'

import Home from './components/Home'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Movies from './components/Movies'
import TopRated from './components/TopRated'
import SingleMovie from './components/SingleMovie'




const App = () => (
  <BrowserRouter basename="/Movify">
    <NavBar/>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/discover/movie" component={Movies}/>
      <Route exact path="/movie/top_rated" component={TopRated}/>
      <Route exact path="/movie/:id" component={SingleMovie}/>
    </Switch>
    <Footer/>
  </BrowserRouter>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)