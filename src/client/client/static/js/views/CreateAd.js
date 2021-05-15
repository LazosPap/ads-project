import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Δημιουργία Αγγελίας');
	}

	async getHtml() {
    const categories = await getCategories();
    import('../Utilities/CreateAd.js');
		return `<div class="createAdContainer">
  <label>Τίτλος Αγγελίας: </label>
  <div><input type="text" name="adTitleForm" id="adTitleForm"></div>
  <div>Περιγραφή</div>
  <div><textarea id="descriptionForm" rows="10" cols="50" ></textarea></div>
  <div>Τύπος Αγγελίας:
    <select name="categories" id="ad_type">
      <option value="Καινούργιο">Καινούργιο</option>
      <option value="Μεταχειρισμένο">Μεταχειρισμένο</option>
    </select>
  </div>
  <br>
  <div>Κατηγορίες:
    <select name="categories" id="category">
      ${categories}
    </select>
  </div>
  <label>Τιμή: </label>
  <div><input type="text" name="price" id="price"></div>		
  <input type="file" name="images" id="adImages" accept=".png, .jpg" multiple>
  <input type="button" value="Δημιουργία Αγγελίας" id="createAdFormButton" style="width: 200px; cursor: pointer;">
</div>`;
  }
}

async function getCategories() {
	const response = await axios.get('http://localhost:3000/categories/getAll');
	let template = "";
	response.data.sort((catA, catB) => {
		if (catA.categoryName < catB.categoryName) {
			return -1;
		} else {
			return 1;
		}
	});
	const parentCategories = response.data.filter(category => category.parent == '/');
	for (let parentCategory of parentCategories) {
		template += `<optgroup label="${parentCategory.categoryName}">`;
		for (let category of response.data) {
			if (category.parent == parentCategory._id) {
				template += `<option value="${category._id}">${category.categoryName}</option>`;
			}
		}
		template += `</optgroup>`;
	}
	return template
}
