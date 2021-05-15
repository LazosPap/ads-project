import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Είσοδος Χρήστη");
    }

  async getHtml() {
    import('../Utilities/signinregister.js');
        return `<div class="container">
  <input id="signin" type="radio" name="tab" checked="checked" />
  <input id="register" type="radio" name="tab" />
  <div class="pages">
    <div class="page">
      <div class="input">
        <div class="title">Email</div>
        <input class="text" type="text" placeholder="" id="login-email" />
      </div>
      <div class="input">
        <div class="title"> Κωδικός</div>
        <input class="text" type="password" placeholder="" id="login-password" />
      </div>
      <div class="input">
        <input type="submit" value="Είσοδος" id="login" />
      </div>
      <div class="input">
        <div class="title">Ανάκτηση κωδικού μέσω Email</div>
        <input class="text" type="text" placeholder="" id="reset-pwd-email"/>
      </div>
      <div class="input">
        <input type="submit" value="Ανάκτηση" id="reset-pwd" />
      </div>
    </div>
    <div class="page signup">
      <div class="input">
        <div class="title"> 'Ονομα</div>
        <input class="text" type="text" placeholder="" name="surename" />
      </div>
      <div class="input">
        <div class="title"> Επώνυμο</div>
        <input class="text" type="text" placeholder="" name="lastname" />
      </div>
      <div class="input">
        <div class="title"> Διεύθυνση</div>
        <input class="text" type="text" placeholder="" name="address" />
      </div>
      <div class="input">
        <div class="title"> ΤΚ</div>
        <input class="text" type="text" placeholder="" name="postal_code" />
      </div>
      <div class="input">
        <div class="title"> Τηλέφωνο</div>
        <input class="text" type="text" placeholder="" name="phone_number" />
      </div>
      <div class="input">
        <div class="title"> Email</div>
        <input class="text" type="text" placeholder="" name="email" />
      </div>
      <form onsubmit="return checkPassword(this)">
        <div class="input">
          <div class="title"> Κωδικός </div>
          <input class="text" type="password" placeholder="" name="pass1" />
        </div>
        <div class="input">
          <div class="title"> Επαλήθευση Κωδικού </div>
          <input class="text" type="password" placeholder="" name="pass2" />
        </div>
        <div class="input">
          <div class="title"> Εικόνα </div>
          <input type="file" id="avatar" name="avatar" accept=".png">
        </div>
        <div class="input">
          <input type="submit" value="SIGN ME UP!" id="register-btn"/>
        </div>
      </form>
    </div>
  </div>
  <div class="tabs">
    <label class="tab text" for="signin">
      Sign In</label>
    <label class="tab text" for="register">
      Register</label>
  </div>
</div>
`;
    }
}