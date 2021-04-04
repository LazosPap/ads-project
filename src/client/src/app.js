import Header from './components/Header';
import Categories from './components/Categories';

import './scss/app.scss'

const app = () => {
    document.getElementById('header').innerHTML = Header();
    document.getElementById('container').innerHTML = Categories();
}


app();