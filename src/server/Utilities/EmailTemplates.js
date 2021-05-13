function emailTemplate(subject, body) {
	`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet"> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>w3newbie HTML Email</title>
    <style type="text/css">
        *{
            font-family: 'Comfortaa', cursive;
            font-size: 20px;
            color: #cccccc;
        }
        body {
            margin: 0;
            background-color: #cccccc;
        }
        table {
            border-spacing: 0;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
        }
        .wrapper {
            width: auto;
            table-layout: fixed;
            background-color: #cccccc;
            padding-bottom: 40px;
        }
        .main {
            background-color: #3f3f3f;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            color: #4a4a4a;
        }
        .two-columns{
            text-align: left;
            font-size: 0;
            padding: 40px 0;
        }
        .two-columns .column{
            width: 100%;
            max-width: 300px;
            display: inline-block;
            vertical-align: top;
            
        }
        .two-columns .content{
            text-align: left;
            font-size: 15px;
            line-height: 20px;
        }
        .last{
            text-align: center;
    
        }
        .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        }
        @media screen and (max-width: 600px) { 
    
        }
    </style>
    </head>
    <body>
    
        <center class="wrapper">
    
            <table class="main" width="100%">
    
    <!-- SOCIAL MEDIA ICONS -->
                <tr>
                    <td>
                        <table width="100%">
                            
                            <a href="#"><img src="https://drive.google.com/file/d/1U7i-1fE85k4tD6oWB2v93kvRmKCqLIsr/view?usp=sharing"></a>
    
                            <td style="text-align: center;" >
                                <p style="font-size: 24px;">${subject}</p>
                            </td>
    
                        </table>
                    </td>
                </tr>
    
    <!-- LOGO SECTION -->
    
    
    <!-- GIF BANNER IMAGE -->
    
    
    <!-- TITLE, TEXT & BUTTON -->
    
    
    <!-- BLUE BORDER -->
    
    
    <!-- TWO COLUMN SECTION -->
    
                <tr>
                    <td>
                        <table width="100%">
    
                            <tr>
                                <td class="two-columns">
    
                                    <table class="column">
                                        <tr>
                                            <td class="padding">
    
                                                <table class="content">
                                                    <tr>
                                                        <td>
                                                            <a href="#"><img src="https://drive.google.com/file/d/1flDFLcevgqw-RHylxd0I-HKYcsMJwEr-/view?usp=sharing"
                                                                alt="" width="260px" style="max-width: 260px; border-radius: 20px;"></a>
                                                        
                                                        </td>
                                                    </tr>
                                                </table>
    
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <table class="column">
                                        <tr>
                                            <td class="padding">
    
                                                <table class="content">
                                                    <tr>
                                                        <td>
                                                            <p style="font-size: 17px;">${body}</p>													
                                                        </td>
                                                    </tr>
                                                </table>
    
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
    
                        </table>
                    </td>
                </tr>
    
    <!-- BLUE BACKGROUND QUOTE -->
                <tr>
                    <td>
                        <table class="last" width="100%">
    
                            <tr>
                                <td>
                                    <p>Επισκεφτείτε την ιστοσελίδα 
                                        μας πατώντας στον παρακάτω σύνδεσμο</p>
                                    <p>Με εκτίμηση, η ομάδα του Mother Tech.</p>
                                    <a href="http://localhost:3000/"><button style="border-radius: 10px;" class="button">Visit Us</button></a>
                                </td>
                            </tr>
    
                        </table>
                    </td>
                </tr>
    
    <!-- FOOTER SECTION -->
            </table>
    
        </center>
    
    </body>
    </html>`;
}

function resetPasswordBody(newPassword) {
	return {
		subject: 'Επαναφορά κωδικού πρόσβασης',
		html: `Ο νέος κωδικός πρόσβασής σας είναι:

        <b>${newPassword}</b>
        
        Μπορείτε να τον αλλάξετε από την σελίδα των επιλογών σας`,
	};
}
function registerUserBody() {
	return {
		subject: 'Καλωσορίσατε στον ιστότοπο μας',
		html: `Θα θέλαμε να σας ευχαριστήσουμε για την εγγραφή
        στον ιστότοπο μας. Στην ιστοσελίδα μας θα βρείτε
        αγγελίες σε διάφορα προϊόντα τεχνολογίας τα οποία
        μπορεί να σας κινήσουν το ενδιαφέρον.`,
	};
}

module.exports = {
	emailTemplate,
	resetPasswordBody,
	registerUserBody,
};
