const title = document.getElementById('adTitleForm');
const description = document.getElementById('descriptionForm');
const adType = document.getElementById('ad_type');
const category = document.getElementById('category');
const price = document.getElementById('price');

document.getElementById('createAdFormButton').addEventListener('click', async (e) => {
		e.preventDefault();
		let formData = new FormData();
        let imageFiles = document.getElementById('adImages');
        for (let image of imageFiles.files) {
			formData.append('images', image);
		}
		formData.append('title', title.value);
		formData.append('description', description.value);
		formData.append('adType', adType.value);
		formData.append('categoryId', category.value);
		formData.append('price', price.value);
		formData.append('userId', window.localStorage.getItem('userID'));

		const response = await axios.post(
			'http://localhost:3000/ads/create',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${window.localStorage.getItem('token')}`,
				},
			}
		);
		if (response.status === 200) {
            alert('Ad Created Successfully');
			window.location.href = "/";
		}
	});
