import Index from "./views/Index.js";
import Products from "./views/Products.js";
import ProductView from "./views/ProductView.js";
import SigninRegister from "./views/SigninRegister.js";
import CreateAd from "./views/CreateAd.js";
import Page404 from "./views/404.js";
import Categories from "./views/Categories.js";
import Search from "./views/Search.js";

import checkState from '../js/Utilities/CheckState.js'

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

export default function navigateTo(url) {
    history.pushState(null, null, url);
    router();
    checkState();
};

const router = async () => {
    const routes = [
        { path: "/", view: Index },
        { path: "/404", view: Page404 },
        { path: "/products", view: Products },
        { path: "/signinregister", view: SigninRegister },
        { path: "/product/:id", view: ProductView },
        { path: "/createad", view: CreateAd },
        { path: "/categories/:id", view: Categories },
        { path: "/search/:searchParams", view: Search },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[1],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});
