/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const intern = require('intern').default;
const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const selectors = require('../lib/selectors');
const FunctionalHelpers = require('../lib/helpers');

const config = intern._config;
const EMAIL_FIRST = config.fxaContentRoot;
const SETTINGS_V2_URL = `${config.fxaContentRoot}beta/settings`;
const password = 'passwordzxcv';

const { createEmail } = FunctionalHelpers;

const {
  clearBrowserState,
  click,
  createUser,
  openPage,
  fillOutEmailFirstSignIn,
  testElementExists,
  testElementTextEquals,

  type,
} = FunctionalHelpers.helpersRemoteWrapped;

describe('display name', () => {
  let email;
  beforeEach(async ({ remote }) => {
    email = createEmail();
    await clearBrowserState(remote);
    await createUser(email, password, { preVerified: true }, remote);

    await openPage(EMAIL_FIRST, selectors.ENTER_EMAIL.HEADER, remote);
    await fillOutEmailFirstSignIn(email, password, remote);
    await testElementExists(selectors.SETTINGS.HEADER, remote);

    // Open new settings
    await openPage(SETTINGS_V2_URL, selectors.SETTINGS_V2.HEADER, remote);

    await click(
      selectors.SETTINGS_V2.DISPLAY_NAME.ADD_BUTTON,
      selectors.SETTINGS_V2.DISPLAY_NAME.TEXTBOX_LABEL,
      remote
    );
    await type(
      selectors.SETTINGS_V2.DISPLAY_NAME.TEXTBOX_FIELD,
      'Test User',
      {},
      remote
    );
  });

  it('can add a display name', async ({ remote }) => {
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.SUBMIT_BUTTON, remote);

    // Verify the saved name is displayed
    await testElementTextEquals(
      selectors.SETTINGS_V2.DISPLAY_NAME.SAVED_DISPLAY_NAME,
      'Test User',
      remote
    );

    // Also check the avatar dropdown displays the saved name
    await click(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.MENU_BUTTON,
      remote
    );
    await testElementTextEquals(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.DISPLAY_NAME_LABEL,
      'Test User',
      remote
    );
  });

  it('can click cancel and not add a display name', async ({ remote }) => {
    // Click cancel without providing a display name
    await click(
      selectors.SETTINGS_V2.DISPLAY_NAME.CANCEL_BUTTON,
      selectors.SETTINGS_V2.HEADER,
      remote
    );

    // Verify the display name is not saved
    await testElementTextEquals(
      selectors.SETTINGS_V2.DISPLAY_NAME.SAVED_DISPLAY_NAME,
      'None',
      remote
    );

    // Also check the avatar dropdown displays the email id
    await click(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.MENU_BUTTON,
      remote
    );
    await testElementTextEquals(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.DISPLAY_NAME_LABEL,
      email,
      remote
    );
  });

  it('can change a display name', async ({ remote }) => {
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.SUBMIT_BUTTON, remote);

    // Click change and change the display name
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.ADD_BUTTON, remote);
    await type(
      selectors.SETTINGS_V2.DISPLAY_NAME.TEXTBOX_FIELD,
      'New User',
      {},
      remote
    );
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.SUBMIT_BUTTON, remote);
    // Verify the saved name is displayed
    await testElementTextEquals(
      selectors.SETTINGS_V2.DISPLAY_NAME.SAVED_DISPLAY_NAME,
      'New User',
      remote
    );

    // Also check the avatar dropdown displays the saved name
    await click(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.MENU_BUTTON,
      remote
    );
    await testElementTextEquals(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.DISPLAY_NAME_LABEL,
      'New User',
      remote
    );
  });

  it('can click cancel and not change display name', async ({ remote }) => {
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.SUBMIT_BUTTON, remote);

    // Click change to change the display name
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.ADD_BUTTON, remote);
    await type(
      selectors.SETTINGS_V2.DISPLAY_NAME.TEXTBOX_FIELD,
      'New User',
      {},
      remote
    );

    // Click cancel and don't save the new display name
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.CANCEL_BUTTON, remote);
    // Verify the previous name is displayed
    await testElementTextEquals(
      selectors.SETTINGS_V2.DISPLAY_NAME.SAVED_DISPLAY_NAME,
      'Test User',
      remote
    );

    // Also check the avatar dropdown displays the saved name
    await click(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.MENU_BUTTON,
      remote
    );
    await testElementTextEquals(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.DISPLAY_NAME_LABEL,
      'Test User',
      remote
    );
  });

  it('can remove a display name', async ({ remote }) => {
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.SUBMIT_BUTTON, remote);

    // Click change to change the display name
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.ADD_BUTTON, remote);
    await type(
      selectors.SETTINGS_V2.DISPLAY_NAME.TEXTBOX_FIELD,
      '',
      {},
      remote
    );

    // Click submit without providing a display name
    await click(selectors.SETTINGS_V2.DISPLAY_NAME.SUBMIT_BUTTON, remote);
    // Verify there is no display name
    await testElementTextEquals(
      selectors.SETTINGS_V2.DISPLAY_NAME.SAVED_DISPLAY_NAME,
      'None',
      remote
    );

    // Also check the avatar dropdown displays email id
    await click(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.MENU_BUTTON,
      remote
    );
    await testElementTextEquals(
      selectors.SETTINGS_V2.AVATAR_DROP_DOWN_MENU.DISPLAY_NAME_LABEL,
      email,
      remote
    );
  });
});
