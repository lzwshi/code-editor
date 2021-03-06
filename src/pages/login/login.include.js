import tag from 'html-tag-js';
import mustache from 'mustache';

import Page from "../../components/page";
import _template from './login.hbs';
import './login.scss';
import helpers from '../../modules/helpers';
import gitHub from '../github/gitHub';
import fs from '../../modules/utils/internalFs';

export default function GithubLoginInclude() {
  const $page = Page('Github Login');
  const $content = tag.parse(mustache.render(_template, strings));
  /**@type {HTMLFormElement} */
  const $form = $content.get('.form');
  const $username = $content.get("#username");
  const $password = $content.get("#password");
  const $token = $content.get("#token");
  const $errorMsg = $content.get('#error-msg');
  fs.deleteFile(cordova.file.externalDataDirectory + '.github');

  $page.append($content);

  $content.onclick = handelClick;
  $form.onsubmit = storeCredentials;

  actionStack.push({
    id: 'github login',
    action: $page.hide
  });

  $page.onhide = function () {
    actionStack.remove('github login');
  };

  $page.setMessage = function (msg) {
    $errorMsg.textContent = msg;
  };

  document.body.appendChild($page);

  /**
   * 
   * @param {MouseEvent} e 
   */
  function handelClick(e) {
    /**
     * @type {HTMLElement}
     */
    const $el = e.target;

    if ($el instanceof HTMLInputElement) $errorMsg.textContent = '';
  }

  function storeCredentials(e) {
    e.preventDefault();
    let token = $token.value;
    let username = $username.value;
    let password = $password.value;
    const credentials = helpers.credentials;

    if (!username && !token)
      return ($errorMsg.textContent = 'Please enter username and password or token!');


    if (token) {
      localStorage.setItem('token', credentials.encrypt(token));
    }
    if (username) {
      if (!password) return ($errorMsg.textContent = 'Please enter password!');
      username = credentials.encrypt(username);
      password = credentials.encrypt(password);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    }

    gitHub({
      $loginPage: $page
    });
  }
}