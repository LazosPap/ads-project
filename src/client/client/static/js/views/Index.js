import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Αρχική Σελίδα");
    }

    async getHtml() {
        import('../Utilities/Search.js');
        return `
        <section class="searchArea">
        <div class="textfieldSearch">
            <input type="text" name="search" autocomplete="off" placeholder="Αναζήτηση" id="searchText">
            <i class="fas fa-search fa-2x" id="search-btn"></i>
        </div>
    </section>
    <section class="categoryTitle">
        <div class="titleText">
            <h1>Κατηγορίες Προϊόντων</h1>
        </div>
    </section>
    <section class="cards">
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/PC Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Ηλεκτρονικοί Υπολογιστές</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Sound Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Ήχος</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Mobile Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Κινητά</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Laptop Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Λάπτοπ</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Monitor Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Εικόνα</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Gadgets Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Gadgets</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Peripheral Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Περιφερειακά</h2>
                </div>
            </a>
            </div>
            <div class="card">
                <a href="#">
                <div class="cardImage">
                    <img src="/static/images/Camera Category.png" alt="">
                </div>
                <div class="cardText">
                    <h2>Φωτογραφία & Βίντεο</h2>
                </div>
            </a>
            </div>
        </div>
    </section>
        `;
    }
}