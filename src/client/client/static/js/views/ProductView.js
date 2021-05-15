import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.adId = params.id;
		this.setTitle('Αγγελία');
	}

	async getHtml() {
		const response = await axios.post('http://localhost:3000/ads/getOne', {
			adId: this.adId,
		});
		const ad = response.data.adData;
		const user = await axios.post('http://localhost:3000/users/getUserData', {
			userId: ad.userId,
		});
		const userData = user.data.userData;
		const date = new Date(ad.dateRegistered).toLocaleString('en-GB', {
			timeZone: 'UTC',
		});
		const valid = ad.valid ? 'Ενεργή' : 'Μη Ενεργή';

		let imageTemplate = ``;

		for (let image of ad.images) {
			imageTemplate += `
      <div class="gallery">
          <a target="_blank" href="img_5terre.jpg">
            <img src="http://localhost:3000/adImages/${ad._id}/${image}" alt="image1" width="400px" height="auto" id="im1">
          </a>
        </div>`;
		}

		return `
        <div class="container">
        <label id="status">${valid}</label><br/>Ημερομηνία Καταχώρησης:<label id="date_posted">${date}</label>
        <h2><b>${ad.title}</b></h2>
        ${imageTemplate}
        <br>
        </br>
        <br>
        <p id="descryption">
          ${ad.description}    
        </p>
        <br />
        <p>Όνομα: <label id="name">${userData.fullName}</label></p><p>Τηλέφωνο: <label id="telephone">${userData.phoneNumber}</label></p><p>Τιμή: <label id="price">${ad.price} &euro;</label></p>Διεύθυνση: ${userData.address} <label id="area"></label> TK: <label id="postal_code">${userData.postalCode}</label><p><br/>Ημερομηνία Ενημέρωσης: <label id="date_updated"></label></p>              
      </div>
        `;
	}
}
