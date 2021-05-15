import navigateTo from '../index.js';

function checkPassword(password1, password2) {
	// If password not entered
	if (password1 == '') alert('Please enter Password');
	// If confirm password not entered
	else if (password2 == '') alert('Please enter confirm password');
	// If Not same return False.
	else if (password1 != password2) {
		alert('\nPassword did not match: Please try again...');
		return false;
	}

	// If same return True.
	else {
		return true;
	}
}

document.getElementById('login').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await login(email, password);
});

document.getElementById('register-btn').addEventListener('click', async (e) => {
	e.preventDefault();
	if (
		!checkPassword(
			document.getElementsByName('pass1')[0].value,
			document.getElementsByName('pass2')[0].value
		)
	) {
		return;
	}
	let formData = new FormData();
	let imagefile = document.querySelector('#avatar');
    formData.append('profilePic', imagefile.files[0]);
    formData.append('firstName', document.getElementsByName('surename')[0].value);
    formData.append('lastName', document.getElementsByName('lastname')[0].value);
    formData.append('address', document.getElementsByName('address')[0].value);
    formData.append('postalCode', document.getElementsByName('postal_code')[0].value);
    formData.append('phoneNumber', document.getElementsByName('phone_number')[0].value);
    formData.append('email', document.getElementsByName('email')[0].value);
    formData.append('password', document.getElementsByName('pass1')[0].value);
    
	const response = axios.post('http://localhost:3000/users/register', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	console.log(response);
	if (response.statusCode === 400) {
		alert("Το email ή ο κωδικός πρόσβασης είναι λάθος")
	}
    if (response.status === 200) {
		await login(document.getElementsByName('email')[0].value, document.getElementsByName('pass1')[0].value);
	}
});

document.getElementById("reset-pwd").addEventListener("click", async (e) => {
	e.preventDefault();
	const emailElem = document.getElementById("reset-pwd-email");
	if (emailElem.value === "") {
		alert("Παρακαλώ εισάγετε email")
		return
	}
	const response = await axios.post("http://localhost:3000/users/resetPassword", {
		email: emailElem.value
	});
	if (response.status === 200) {
		alert("Σας έχει σταλεί ένα email με τον νέο σας κωδικό");
		navigateTo("/");
	} else if (response.status === 400) {
		alert("Δεν βρέθηκε ο χρήστης με αυτό το email")
	} else {
		alert("Κάτι πήγε στραβά. Παρακαλώ προσπαθήστε ξανά")
	}
})


async function login(email, password) {
    const response = await axios.post('http://localhost:3000/users/login', {
		email: email,
		password: password,
	});
	if (response.status >= 400 && response.status < 500) {
		alert('Problem Authenticating');
	}
	if (response.status === 200) {
		window.localStorage.setItem('token', response.data.token);
        window.localStorage.setItem('userID', response.data.userID);
        navigateTo("/");
    }
    document.getElementById("userAvatar").href = "/user";
	document.getElementById("avatar-img").src = `http://localhost:3000/userImages/${response.data.userID}.png`;
	document.getElementById("dropmenu").style.opacity = "1";
}