export default async function renderAds(data, sort) {
	let template = ``;
	for (let ad of data) {
		const date = new Date(ad.dateRegistered).toLocaleString('en-GB', {
			timeZone: 'UTC',
		});
		const valid = ad.valid ? 'Ενεργή' : 'Μη Ενεργή';
		template += `<a href="/product/${ad._id}" style="text-decoration: none;" data-link>
    <li class="product-card">
        <img src="http://localhost:3000/adImages/${ad._id}/${
			ad.images[0]
		}" alt="">

        <div class="card-content">
            <h4 class="product-title">
                ${ad.title}
            </h4>
            <p class="username">${valid}</p>
            <p class="date-creation">${date}</p>
            <p class="price">${parseFloat(ad.price).toFixed(2)} &euro;</p>
        </div>
    </li>
</a>
`;
	}
	return template;
}
