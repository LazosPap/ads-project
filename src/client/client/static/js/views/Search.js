import AbstractView from './AbstractView.js';
import renderAds from '../Utilities/RenderAds.js';

export default class extends AbstractView {
	constructor(params) {
        super(params);
        this.searchParams = params.searchParams.replace("%20"," ")
		this.setTitle('Δημιουργία Αγγελίας');
	}

	async getHtml() {
    const ads = await getAds(this.searchParams);
        return `<div class="products-heading">
    <h2>Προϊόντα</h2>
</div>
<div class="main-section">

    <section class="products-list">
        <div class="select-box">
            <select name="" id="order-list">
                <option value="price-asc">Τιμή Αύξουσα</option>
                <option value="price-desc">Τιμή Φθίνουσα</option>
                <option value="date-create">Ημερομηνία Καταχώρησης</option>
                <option value="date-update">Ημερομηνία Ενημέρωσης</option>
            </select>
        </div>
        <ol class="list-ol-products">
            ${ads}
        </ol>

    </section>
    <section class="sidebar">

        <div class="filters">
        <h4 class="h4-filters">Τελευταία Ενημέρωση</h4>
        <ul class="filter-ul">
            <li><input type="radio" name="last-update">Σήμερα</li>
            <li><input type="radio" name="last-update">Τελευταίες 3 Μέρες</li>
            <li><input type="radio" name="last-update">Τελευταία Εβδομάδα</li>
            <li><input type="radio" name="last-update">Τελευταίος Μήνας</li>
        </ul>
        <h4 class="h4-filters">Ημερομηνία καταχώρησης</h4>
        <ul class="filter-ul">
            <li><input type="radio" name="creation-date">Σήμερα</li>
            <li><input type="radio" name="creation-date">Τελευταίες 3 Μέρες</li>
            <li><input type="radio" name="creation-date">Τελευταία Εβδομάδα</li>
            <li><input type="radio" name="creation-date">Τελευταίος Μήνας</li>
        </ul>
</div>
</section>
</div>

`;
  }
}

async function getAds(searchParams) {
    const response = await axios.post("http://localhost:3000/ads/search", {
        pattern: searchParams
    })
    response.data.result.sort((a, b) => {
        if (a.score < b.score) {
            return -1
        } else {
            return 1
        }
    })
    return renderAds(response.data.result,null);
}

