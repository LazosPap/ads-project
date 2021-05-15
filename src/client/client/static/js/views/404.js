import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Δημιουργία Αγγελίας');
	}

	async getHtml() {

        return `
        <link rel="stylesheet" href="/static/css/404.css">
        <center class="wrapper">
        <table class="main" width="100%">
            <table class="column">
                <tr>
                    <td class="padding">
    
                        <table class="content">
                            <tr> 
                                <td>
                                    <img src="/static/images/404.png" style="width: 100%; border-radius: 30px;" >
                                    <tr>
                                        <td>
                                        <b>
                                            <p style="color: white; font-size: 17px; width:40vw; margin:50px 0; text-align: center">Error 404. Η σελίδα που αναζητήσατε δεν υπάρχει.
                                                Για δική σας διευκόλυνση μπορείτε να πατήσετε στον παρακάτω σύνδεσμο 
                                                και να μεταφερθείτε στην αρχική σελίδα.</p>
                                        </b>													
                                        </td>
                                    </tr>
                                </td>
                            </tr>
                        </table>
    
                    </td>
                </tr>
            </table>
        </table>
        <a href="/" style="border-radius: 10px;" class="button" data-link>Αρχική σελίδα</a>
        </center>`;
  }
}
