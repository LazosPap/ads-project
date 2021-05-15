export default function checkState() {
	let token = window.localStorage.getItem('token');
	let userID = window.localStorage.getItem('userID');
	if (token) {
		document.getElementById('userAvatar').href = '/user';
		document.getElementById('dropmenu').style.opacity = '1';
		document.getElementById('createAdButton').style.display = 'block';
		document.querySelector('.nav-links').style.width = '35%';
		document.getElementById(
			'avatar-img'
		).src = `http://localhost:3000/userImages/${userID}.png`;
	}
	if (!token) {
		document.getElementById('dropmenu').style.opacity = '0';
		document.getElementById('createAdButton').style.display = 'none';
		document.querySelector('.nav-links').style.width = '15%';
	}
}

checkState();