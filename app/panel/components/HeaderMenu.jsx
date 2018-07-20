/**
 * Header Menu Component
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2018 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

/* eslint no-useless-concat: 0 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import ClickOutside from './BuildingBlocks/ClickOutside';
import { sendMessage, sendMessageInPromise } from '../utils/msg';
import globals from '../../../src/classes/Globals';
import { log } from '../../../src/utils/common';
/**
 * @class Implement drop-down menu invoked from kebab
 * menu icon on the panel header.
 * @memberof PanelClasses
 */
class HeaderMenu extends React.Component {
	constructor(props) {
		super(props);

		// event bindings
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.clickSettings = this.clickSettings.bind(this);
		this.clickBrokenPage = this.clickBrokenPage.bind(this);
		this.clickSubmitTracker = this.clickSubmitTracker.bind(this);
		this.clickSignedInAs = this.clickSignedInAs.bind(this);
		this.clickSignIn = this.clickSignIn.bind(this);
		this.clickSignOut = this.clickSignOut.bind(this);
	}
	/**
	 * Handle clicks outside of the drop-down menu and trigger action.
	 * @param  {Object} evt mouseclick event
	 */
	handleClickOutside(evt) {
		// eslint-disable-next-line react/no-find-dom-node
		if (!ReactDOM.findDOMNode(this).contains(evt.target)) {
			this.props.toggleDropdown();
		}
	}
	/**
	 * Trigger action which open Settings panel from drop-down menu Settings item.
	 */
	clickSettings() {
		this.props.toggleDropdown();
		this.props.history.push('/settings');
	}
	/**
	 * Handle click on 'Report a broken page' menu item.
	 * Currently invokes default 'mailto' handler, and often does not work.
	 * @todo  Should send broken page data to a 'Report a broken page' site.
	 */
	clickBrokenPage() {
		sendMessageInPromise('getSiteData').then((data) => {
			let body = `${'PLEASE INCLUDE A DESCRIPTION AND A PICTURE OF THE ISSUE YOU ARE EXPERIENCING:' + '\r\n\r\n\r\n\r\n\r\n\r\n' +
					'URL: '}${data.url}\r\n` +
					`Ghostery version: ${data.extensionVersion}\r\n` +
					`Database Version: ${data.dbVersion}\r\n` +
					`Browser name: ${data.browserDisplayName}\r\n` +
					`Browser version: ${data.browserVersion}\r\n` +
					`Language: ${data.language}\r\n` +
					`OS: ${data.os}\r\n`;

			data.categories.forEach((category) => {
				const trackersAllowed = [];
				const trackersBlocked = [];

				category.trackers.forEach((tracker) => {
					if (tracker.blocked) {
						trackersBlocked.push(tracker.name);
					} else {
						trackersAllowed.push(tracker.name);
					}
				});

				body += `\r\nCategory: ${category.name}\r\n` +
						`Allowed Trackers: ${trackersAllowed}\r\n` +
						`Blocked Trackers: ${trackersBlocked}\r\n`;
			});

			const url = `mailto:support@ghostery.com?body=${encodeURIComponent(body)}&subject=Broken Page Report`;
			sendMessage('openNewTab', {
				url,
				become_active: true,
			});
		}).catch((err) => {
			log('Error gathering page data');
		});
		window.close();
	}
	/**
	 * Handle click on 'Submit a new tracker' menu item.
	 * It should naviaget to a site where tracker data can be entered.
	 */
	clickSubmitTracker() {
		sendMessage('openNewTab', {
			url: 'https:\/\/www.ghostery.com/support/submit-tracker/',
			become_active: true,
		});
		window.close();
	}

	/**
	 * Handle click on the user name, displayed on the menu when a
	 * user is in logged in state, and navigate to the user's profile page.
	 */
	clickSignedInAs() {
		sendMessage('openNewTab', {
			url: `https:\/\/account.${globals.GHOSTERY_DOMAIN}.com/`,
			become_active: true,
		});
		window.close();
	}

	/**
	 * Handle click on 'Sign in' menu item and navigate to Login panel.
	 */
	clickSignIn() {
		sendMessage('ping', 'sign_in');
		this.props.toggleDropdown();
		this.props.history.push('/login');
	}
	/**
	 * Handle click on 'Sign out' menu item (if user is in logged in state) and log out the user.
	 */
	clickSignOut() {
		this.props.toggleDropdown();
		this.props.actions.logout();
	}
	/**
	 * Handle disabling/enabling of the Supporter menu item
	 */
	SupporterMenuItemBase(loggedIn) {
		return 	<div>
					<div className="menu-icon-container">
						<svg width="23px" height="16px" viewBox="0 0 23 16">
						    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
						        <g transform="translate(-387.000000, -225.000000)" fill="#CCCCCC">
						            <g className="supporter-icon" transform="translate(388.000000, 226.000000)">
						                <g fillRule="nonzero">
						                    <path d="M21,3.5016876 L16.8632333,3.5016876 C16.8231,3.22609669 16.7416667,2.95481543 16.5634,2.71687728 C16.2358,2.27933418 15.7045,2.10309209 15.2355,1.9477178 C14.9531667,1.85426639 14.6867,1.76580511 14.5070333,1.63878379 C14.3313333,1.51448435 14.1649667,1.29741398 13.9885667,1.06764148 C13.6906,0.678865502 13.3529667,0.238373697 12.8165333,0.069163148 C12.3001667,-0.0936963349 11.7705,0.0643998483 11.3036,0.203896481 C11.0112333,0.291223641 10.7354333,0.373560677 10.5002333,0.373560677 C10.2652667,0.373560677 9.98923333,0.291223641 9.69686667,0.203896481 C9.22973333,0.0643998483 8.69983333,-0.0936963349 8.18393333,0.0689363242 C7.64726667,0.238373697 7.30916667,0.679092325 7.0112,1.06786831 C6.83526667,1.29741398 6.6689,1.51448435 6.49343333,1.63855697 C6.31376667,1.76557829 6.0473,1.85403957 5.76496667,1.94749097 C5.2962,2.10286527 4.76443333,2.27910736 4.43706667,2.71642363 C4.2588,2.95436179 4.17736667,3.22586987 4.13723333,3.50123395 L0,3.50123395 L1.35146667,6.99999095 L0,10.4980675 L4.137,10.4980675 C4.1769,10.7736584 4.25856667,11.0449396 4.4366,11.2831046 C4.7642,11.7204209 5.29573333,11.896663 5.7645,12.0520373 C6.04683333,12.1457155 6.31353333,12.23395 6.4932,12.3609713 C6.66843333,12.4852707 6.8348,12.7021143 7.01096667,12.9318868 C7.30893333,13.3206627 7.64703333,13.7613814 8.1837,13.9308187 C8.6989,14.0934514 9.22926667,13.9353552 9.69663333,13.7960854 C9.989,13.7089851 10.2648,13.6264212 10.5,13.6264212 C10.7352,13.6264212 11.011,13.7087583 11.3033667,13.7960854 C11.6295667,13.8936196 11.9861,14 12.3473,14 C12.5034,14 12.6604333,13.9800395 12.8160667,13.9308187 C13.3527333,13.7616082 13.6903667,13.3211164 13.9883333,12.9323404 C14.1645,12.7025679 14.3308667,12.4854975 14.5068,12.3611981 C14.6864667,12.2341768 14.9529333,12.1457155 15.2352667,12.0522641 C15.7042667,11.8968898 16.2358,11.7206477 16.5631667,11.2831046 C16.7414333,11.0449396 16.8228667,10.7736584 16.8627667,10.4982943 L21,10.4982943 L19.6485333,6.99999095 L21,3.5016876 Z M1.3517,9.58805042 L2.35176667,6.99999095 L1.3517,4.41193148 L4.08916667,4.41193148 C4.08216667,4.61357783 4.06606667,4.80025381 4.01543333,4.9517721 C3.95056667,5.14616009 3.79213333,5.36323046 3.6246,5.59322979 C3.33433333,5.99107872 3.00533333,6.44245806 3.00533333,6.99999095 C3.00533333,7.55775065 3.33433333,8.00867635 3.6246,8.40675211 C3.79213333,8.63652461 3.95056667,8.8538218 4.01543333,9.04820979 C4.06606667,9.19972808 4.08216667,9.38640406 4.08916667,9.58805042 L1.3517,9.58805042 Z M16.6119333,7.88029408 C16.4110333,8.15588499 16.2031333,8.44077567 16.0941667,8.76717511 C15.9805333,9.10718398 15.9747,9.46556557 15.9688667,9.81237915 C15.9625667,10.1902676 15.9565,10.5472882 15.8064667,10.7478005 C15.6534,10.9523955 15.3036333,11.0683025 14.9335667,11.1910142 C14.5975667,11.3023846 14.2503667,11.4173843 13.9561333,11.6256085 C13.6656333,11.8311109 13.4481667,12.1146406 13.2379333,12.3886438 C13.0025,12.6955364 12.7803667,12.9854172 12.5269667,13.0652592 C12.292,13.1392037 11.9450333,13.0357721 11.5784667,12.9262162 C11.2329,12.8230113 10.8756667,12.7164042 10.5,12.7164042 C10.1245667,12.7164042 9.7671,12.8230113 9.42176667,12.9262162 C9.05426667,13.0357721 8.70753333,13.1396574 8.47256667,13.0652592 C8.21963333,12.9854172 7.99703333,12.6953095 7.76136667,12.3881901 C7.55136667,12.114187 7.33413333,11.8308841 7.04386667,11.6256085 C6.74963333,11.4173843 6.4022,11.3023846 6.06643333,11.1910142 C5.69613333,11.0683025 5.34636667,10.9523955 5.1933,10.7478005 C5.04303333,10.5470614 5.0372,10.1900408 5.0309,9.81215232 C5.0253,9.46556557 5.01923333,9.10718398 4.90583333,8.76740194 C4.79686667,8.4410025 4.58896667,8.15611182 4.38806667,7.88074773 C4.15846667,7.56568948 3.94146667,7.26809667 3.94146667,7.00021777 C3.94146667,6.73256569 4.15846667,6.43474606 4.38806667,6.11968781 C4.58896667,5.84432372 4.79686667,5.55943304 4.90583333,5.2330336 C5.01923333,4.89325156 5.02506667,4.53509679 5.03113333,4.18851004 C5.0372,3.81039478 5.0435,3.45337413 5.19353333,3.25263507 C5.3466,3.04804001 5.69636667,2.93213305 6.06666667,2.80942138 C6.40243333,2.6980509 6.74963333,2.58305124 7.04386667,2.374827 C7.33413333,2.16955146 7.55136667,1.88602172 7.76136667,1.61224541 C7.99703333,1.30512599 8.2194,1.01501836 8.47256667,0.935176387 C8.52786667,0.917710955 8.58946667,0.91022577 8.65573333,0.91022577 C8.8718,0.91022577 9.14083333,0.990521392 9.42176667,1.0744462 C9.76733333,1.17765102 10.1245667,1.2842582 10.5002333,1.2842582 C10.8756667,1.2842582 11.2331333,1.17765102 11.5787,1.0744462 C11.9462,0.964890304 12.2927,0.861458655 12.5274333,0.935403211 C12.7803667,1.01524519 13.0027333,1.30535282 13.2381667,1.61201858 C13.4484,1.88624855 13.6658667,2.16977829 13.9563667,2.37505382 C14.2506,2.58305124 14.5978,2.69827772 14.9338,2.80964821 C15.3038667,2.93235988 15.6536333,3.04826684 15.8067,3.2528619 C15.9572,3.45360095 15.9630333,3.81039478 15.9691,4.18828322 C15.9747,4.53486997 15.9807667,4.89325156 16.0944,5.2330336 C16.2033667,5.55965986 16.4112667,5.84455055 16.6121667,6.12014146 C16.8417667,6.43497288 17.0587667,6.73256569 17.0587667,7.00021777 C17.0585333,7.26764302 16.8415333,7.56523584 16.6119333,7.88029408 Z M19.6483,9.58805042 L16.9108333,9.58805042 C16.9180667,9.38640406 16.9339333,9.19972808 16.9845667,9.04820979 C17.0494333,8.8538218 17.2078667,8.63652461 17.3756333,8.40652528 C17.6656667,8.00867635 17.9946667,7.55752383 17.9946667,6.99999095 C17.9946667,6.44245806 17.6656667,5.99153237 17.3756333,5.59368343 C17.2078667,5.36368411 17.0494333,5.14661374 16.9845667,4.9517721 C16.9339333,4.80025381 16.9178333,4.61357783 16.9108333,4.41193148 L19.6480667,4.41193148 L18.6482333,6.99999095 L19.6483,9.58805042 Z"></path>
						                    <path d="M10.5001176,2.24691358 C7.77834792,2.24691358 5.56410256,4.37902496 5.56410256,7.00011324 C5.56410256,9.62097504 7.77834792,11.7530864 10.5001176,11.7530864 C13.2216521,11.7530864 15.4358974,9.62097504 15.4358974,7.00011324 C15.4358974,4.37925145 13.2216521,2.24691358 10.5001176,2.24691358 Z M10.5001176,10.9760231 C8.22354882,10.9760231 6.37148486,9.19246912 6.37148486,7.00011324 C6.37148486,4.80775737 8.22354882,3.02420339 10.5001176,3.02420339 C12.7764512,3.02420339 14.6285151,4.80775737 14.6285151,7.00011324 C14.6285151,9.19246912 12.7766864,10.9760231 10.5001176,10.9760231 Z"></path>
						                </g>
						                <path d="M12.4812447,8.54196508 C12.2821878,8.09694332 12.2479333,7.71989113 12.2425643,7.57173603 L12.2425643,6.35273575 C12.2425643,5.42151302 11.4622289,4.66666667 10.4996953,4.66666667 C9.53705428,4.66666667 8.756692,5.42151302 8.756692,6.35273575 L8.756692,7.58935777 C8.74922904,7.74872188 8.71011563,8.11427357 8.5187901,8.54196508 C8.26153282,9.11667222 8.47438818,9.04819918 8.66509628,9.00089873 C8.85575068,8.95381026 9.28154194,8.76924575 9.41458661,8.99663241 C9.5475239,9.22388658 9.65844814,9.42130305 9.96885886,9.29257161 C10.2792964,9.16397268 10.4255758,9.12107103 10.4698971,9.12107103 L10.5301645,9.12107103 C10.5744591,9.12107103 10.7207921,9.16397268 11.031176,9.29257161 C11.3416135,9.42130305 11.4525109,9.22388658 11.5855287,8.99663241 C11.7184929,8.76924575 12.1442573,8.95381026 12.3349654,9.00089873 C12.5256466,9.04819918 12.7384215,9.11667222 12.4812447,8.54196508 M9.96171804,5.58604441 C10.1494463,5.58604441 10.3016584,5.81899583 10.3016584,6.1064289 C10.3016584,6.39388847 10.1494463,6.62689289 9.96171804,6.62689289 C9.77398976,6.62689289 9.62175079,6.39388847 9.62175079,6.1064289 C9.62175079,5.81899583 9.77398976,5.58604441 9.96171804,5.58604441 M10.4996953,7.66615145 C10.0860112,7.66615145 9.73777562,7.27229898 9.63283785,6.83403444 C9.83549205,7.10360728 10.1483457,7.27680379 10.4996953,7.27680379 C10.8509912,7.27680379 11.1638448,7.10360728 11.3665258,6.83403444 C11.2615881,7.27229898 10.9132988,7.66615145 10.4996953,7.66615145 M11.0376993,6.62689289 C10.84981,6.62689289 10.6976784,6.39388847 10.6976784,6.1064289 C10.6976784,5.81899583 10.84981,5.58604441 11.0376993,5.58604441 C11.2255082,5.58604441 11.3775861,5.81899583 11.3775861,6.1064289 C11.3775861,6.39388847 11.2255082,6.62689289 11.0376993,6.62689289"></path>
						            </g>
						        </g>
						    </g> 
						</svg>								
					</div>
					<span>{ t('panel_menu_ghostery_supporter') }</span>
				</div>;
	}
	/**
	 * Render drop-down menu.
	 * @return {ReactComponent}   ReactComponent instance
	 */
	render() {
		const { loggedIn, email } = this.props;
		return (
			<ClickOutside onClickOutside={this.handleClickOutside} excludeEl={this.props.kebab}>
				<div className="dropdown-pane" id="header-dropdown">
					<ul className="vertical menu no-bullet icons icon-left">
						<li className="menu-option menu-settings">
							<Link to="/settings/globalblocking" onClick={this.clickSettings}>
								<div className="menu-icon-container">
									<svg width="18px" height="18px" viewBox="0 0 18 18">
										<g>
											<path className="menu-icon" d="M17.9063611,7.4473434 C17.8436479,7.36521204 17.7618042,7.31630721 17.6602547,7.30077273 L15.5157778,6.97267882 C15.39855,6.5976938 15.2383148,6.21494155 15.0352159,5.82427821 C15.1757453,5.62894655 15.3866115,5.35364109 15.6678143,4.99807417 C15.9490171,4.64250725 16.1482323,4.38288011 16.2654601,4.21876124 C16.3280295,4.13274626 16.3590985,4.04299151 16.3590985,3.94920929 C16.3590985,3.8398926 16.3319132,3.75402146 16.277111,3.69145204 C15.9959082,3.29287763 15.3513712,2.62892258 14.3435001,1.69915535 C14.2500056,1.62105145 14.1521959,1.58207142 14.0507903,1.58207142 C13.9335626,1.58207142 13.8397803,1.61716783 13.7694437,1.68736066 L12.1055286,2.94133817 C11.7850581,2.7772193 11.4335187,2.63266236 11.0507664,2.50766735 L10.7226725,0.351539463 C10.7149053,0.249990011 10.6698841,0.165988765 10.5878966,0.0995357237 C10.5057652,0.0330826827 10.4102569,-1.77635684e-15 10.3006526,-1.77635684e-15 L7.69920309,-1.77635684e-15 C7.47265863,-1.77635684e-15 7.33198532,0.109316691 7.27732697,0.32809391 C7.17577752,0.718613404 7.06243338,1.44513788 6.93743838,2.50766735 C6.57022061,2.62503896 6.21479754,2.77347952 5.87102532,2.95313287 L4.25385753,1.69915535 C4.15230808,1.62105145 4.05075863,1.58207142 3.94920918,1.58207142 C3.77732308,1.58207142 3.40823542,1.8612605 2.84180237,2.41992632 C2.27536932,2.97859215 1.89074718,3.39845454 1.68750445,3.67965735 C1.61716779,3.7812068 1.58207138,3.87110539 1.58207138,3.94920929 C1.58207138,4.04299151 1.62105141,4.13677372 1.69915531,4.2304121 C2.22258087,4.8632982 2.64057336,5.40225825 2.95313278,5.84772377 C2.75780112,6.20703047 2.60547695,6.56648101 2.49616026,6.92578771 L0.316443043,7.25388162 C0.230571909,7.26955994 0.156351631,7.32033466 0.0937822111,7.40634964 C0.0312127911,7.49222077 1.77635684e-15,7.58211937 1.77635684e-15,7.67575775 L1.77635684e-15,10.2773511 C1.77635684e-15,10.3790444 0.0312127911,10.4706691 0.0937822111,10.5526566 C0.156351631,10.634788 0.238339147,10.6838366 0.339888596,10.6993711 L2.4845094,11.0158142 C2.59382609,11.3985664 2.7539175,11.7852023 2.96492748,12.1757218 C2.824398,12.3710535 2.61338803,12.6463589 2.33218523,13.0019258 C2.05098244,13.3574927 1.85162332,13.6171199 1.73453939,13.7812388 C1.67196997,13.8673976 1.64075718,13.9570085 1.64075718,14.0507907 C1.64075718,14.1523402 1.66808635,14.2420949 1.7227447,14.3201988 C2.02739304,14.7422188 2.67192999,15.3985504 3.65635553,16.28905 C3.7423705,16.3750649 3.84003633,16.4179286 3.94935302,16.4179286 C4.06658078,16.4179286 4.16424661,16.3828322 4.24235051,16.3126393 L5.89475855,15.058518 C6.21522905,15.2226369 6.5667685,15.3671938 6.94952075,15.4923326 L7.27761465,17.6484605 C7.28552573,17.75001 7.3304031,17.8340112 7.41239062,17.9004643 C7.49437813,17.9670612 7.59017407,18 7.69949076,18 L10.3010841,18 C10.5279162,18 10.6684457,17.8906833 10.7232479,17.6719061 C10.8246535,17.2812428 10.9378538,16.5548621 11.0628488,15.4923326 C11.4300666,15.3751049 11.7856335,15.2265205 12.1292619,15.0468671 L13.7465735,16.3126393 C13.8558902,16.3828322 13.9575835,16.4179286 14.0512218,16.4179286 C14.2229641,16.4179286 14.5901819,16.1407532 15.1525875,15.585971 C15.7152807,15.0313327 16.1019166,14.6093127 16.3126389,14.3201988 C16.3829756,14.2420949 16.4182158,14.1523402 16.4182158,14.0507907 C16.4182158,13.9492413 16.3792358,13.8512877 16.300988,13.7577932 C15.7385824,13.0702488 15.32059,12.5312887 15.0470106,12.1406254 C15.2032183,11.8515115 15.3556864,11.4960884 15.5041269,11.0742123 L17.6720494,10.7462622 C17.7656878,10.7305839 17.8440794,10.6796653 17.906505,10.5936504 C17.9689305,10.5076354 17.9999995,10.4177368 17.9999995,10.3240984 L17.9999995,7.72264885 C18.0001433,7.6210994 17.9690744,7.52947475 17.9063611,7.4473434 L17.9063611,7.4473434 Z M11.1213908,11.1211034 C10.5355396,11.7070984 9.82843326,12.0000959 9.00021551,12.0000959 C8.17199776,12.0000959 7.46503523,11.7070984 6.87904025,11.1211034 C6.29318911,10.5352522 6.00019162,9.82828969 6.00019162,9.00007192 C6.00019162,8.17185415 6.29304527,7.4648916 6.87904025,6.8788966 C7.46503523,6.29304544 8.1721416,6.00004795 9.00021551,6.00004795 C9.82843326,6.00004795 10.5355396,6.29304544 11.1213908,6.8788966 C11.7072419,7.4648916 12.0002394,8.17185415 12.0002394,9.00007192 C12.0002394,9.82828969 11.7072419,10.5352522 11.1213908,11.1211034 L11.1213908,11.1211034 Z" />
										</g>
									</svg>
								</div>
								<span>{ t('panel_menu_settings') }</span>
							</Link>
						</li>
						<li onClick={this.clickBrokenPage} className="menu-option menu-broken-page">
							<div className="menu-icon-container">
								<svg width="19px" height="18px" viewBox="0 0 19 18">
									<g>
										<path className="menu-icon" d="M17.6593575,9.31215301 C18.9509219,8.56554918 19.3820842,6.92109579 18.6312577,5.63083237 L16.138206,1.34260393 C15.3882033,0.0526155015 13.7448434,-0.382422166 12.455476,0.366381607 L8.42616837,2.71014017 L7.90163337,3.89178167 L9.636169,4.80255585 L13.8994577,2.30947652 L16.6594455,7.08224123 L12.7515224,9.37017637 C12.7515224,9.37017637 11.7560044,9.87286212 11.3761971,10.2347519 C10.9963899,10.5969166 10.4729534,11.5398649 10.4729534,11.5398649 L8.113919,15.6820724 L3.34119975,12.9310504 L5.98886568,8.26058282 L4.08790691,8.34748036 L3.92065988,7.03686751 L1.36087416,11.5024659 C0.615265506,12.7957543 1.0626307,14.4349828 2.35639215,15.1760868 L6.6581284,17.6413919 C7.95188986,18.3835959 9.5922289,17.9367335 10.334542,16.6423452 L12.5433562,12.7850296 C12.5433562,12.7850296 12.8704353,12.2177206 13.1129298,11.993327 C13.3543257,11.7686584 13.9390038,11.4744167 13.9390038,11.4744167 L17.6593575,9.31215301 Z" />
										<polygon className="menu-icon" points="4.80242321 2 4 2.28676089 5.13611903 4.2454109 4.80242321 2.00100883" />
										<polygon className="menu-icon" points="0.729020149 2 0 3.64717271 3.61403597 4.34957295 0.729020149 2.00100883" />
									</g>
								</svg>
							</div>
							<span>{ t('panel_menu_report_broken_site') }</span>
						</li>
						<li onClick={this.clickSubmitTracker} className="menu-option menu-submit-tracker">
							<div className="menu-icon-container">
								<svg width="16px" height="16px" viewBox="0 0 16 16">
									<g>
										<path className="menu-icon" d="M15.6817156,6.13639018 C15.4695724,5.92424705 15.2119601,5.81824522 14.9088785,5.81824522 L10.1816153,5.81824522 L10.1816153,1.09084252 C10.1816153,0.787900449 10.075474,0.530288105 9.86347034,0.318144968 C9.6513272,0.106141307 9.39385433,0 9.09063331,0 L6.90894826,0 C6.60600619,0 6.34839385,0.106001831 6.13625071,0.318144968 C5.92410757,0.530288105 5.81810574,0.787900449 5.81810574,1.09084252 L5.81810574,5.81824522 L1.09084252,5.81824522 C0.787900449,5.81824522 0.530288105,5.92424705 0.318144968,6.13639018 C0.106001831,6.34853332 0,6.60600619 0,6.90908774 L0,9.09105174 C0,9.39413329 0.106001831,9.65160615 0.318144968,9.86360982 C0.530288105,10.075753 0.787900449,10.1817548 1.09084252,10.1817548 L5.81810574,10.1817548 L5.81810574,14.909297 C5.81810574,15.212239 5.92410757,15.4699908 6.13625071,15.6819945 C6.34839385,15.8939982 6.60600619,16 6.90894826,16 L9.09077278,16 C9.39399381,16 9.65146668,15.8939982 9.86360982,15.6819945 C10.075753,15.4698514 10.1817548,15.212239 10.1817548,14.909297 L10.1817548,10.1817548 L14.909018,10.1817548 C15.2120996,10.1817548 15.4697119,10.075753 15.681855,9.86360982 C15.8938587,9.65160615 16,9.39413329 16,9.09105174 L16,6.90908774 C15.9998605,6.60600619 15.8939982,6.34839385 15.6817156,6.13639018 L15.6817156,6.13639018 Z" />
									</g>
								</svg>
							</div>
							<span>{ t('panel_menu_submit_tracker') }</span>
						</li>
						<li className="menu-option menu-help">
							<Link to="/help" onClick={this.props.toggleDropdown}>
								<div className="menu-icon-container">
									<svg width="18px" height="18px" viewBox="0 0 18 18">
										<g>
											<path className="menu-icon" d="M16.7932109,4.48238002 C15.9884451,3.10356235 14.8967253,2.01184255 13.5179077,1.20707676 C12.1388023,0.402310975 10.6332646,0 9.00028767,0 C7.36745457,0 5.86148535,0.402310975 4.48266769,1.20707676 C3.10370619,2.01169871 2.01198638,3.10341852 1.2072206,4.48238002 C0.402310975,5.86134152 0,7.36731074 0,9 C0,10.6328331 0.402454811,12.1385146 1.20707676,13.51762 C2.01184255,14.8962938 3.10356235,15.9881575 4.48252385,16.7929232 C5.86148535,17.597689 7.36731074,18 9.00014384,18 C10.6329769,18 12.1389462,17.597689 13.5177638,16.7929232 C14.8965815,15.9883013 15.9883013,14.8964376 16.7930671,13.51762 C17.597689,12.1386585 18,10.6326893 18,9 C18,7.3671669 17.597689,5.86119768 16.7932109,4.48238002 L16.7932109,4.48238002 Z M10.5003596,14.625018 C10.5003596,14.7343338 10.4649758,14.8242317 10.3947835,14.8944239 C10.3247351,14.9646162 10.2348372,14.9997123 10.1255214,14.9997123 L7.87534161,14.9997123 C7.76602579,14.9997123 7.67612792,14.9646162 7.60579182,14.8944239 C7.53545572,14.8242317 7.50035959,14.7343338 7.50035959,14.625018 L7.50035959,12.3748382 C7.50035959,12.2655224 7.53545572,12.1756245 7.60579182,12.1052884 C7.67612792,12.03524 7.76602579,12.0001438 7.87534161,12.0001438 L10.1255214,12.0001438 C10.2348372,12.0001438 10.3247351,12.03524 10.3947835,12.1052884 C10.4649758,12.1756245 10.5003596,12.2655224 10.5003596,12.3748382 L10.5003596,14.625018 L10.5003596,14.625018 Z M13.3537901,7.69914177 C13.256125,7.98825334 13.1468092,8.22472072 13.0256988,8.40825622 C12.9045884,8.59179172 12.7306899,8.77935465 12.5040035,8.97065733 C12.2777485,9.16210385 12.0979527,9.29889246 11.9649039,9.38102316 C11.8322865,9.46286618 11.6406962,9.57433955 11.390852,9.71486791 C11.1330968,9.86330728 10.9203625,10.0566237 10.7525052,10.2949609 C10.584504,10.5331543 10.5005034,10.7266146 10.5005034,10.8749101 C10.5005034,10.9843698 10.4651196,11.0742676 10.3949274,11.1444599 C10.3248789,11.214796 10.2349811,11.2498921 10.1256652,11.2498921 L7.87548545,11.2498921 C7.76616963,11.2498921 7.67627176,11.214796 7.60593566,11.1444599 C7.53559956,11.0742676 7.50050343,10.9843698 7.50050343,10.8749101 L7.50050343,10.4528935 C7.50050343,9.92947212 7.70547059,9.43913314 8.11569257,8.98216426 C8.52591456,8.52505154 8.97712998,8.18717936 9.46933883,7.96840389 C9.84417701,7.79666299 10.1098432,7.62075083 10.2660498,7.44109891 C10.422544,7.261447 10.5006473,7.02296591 10.5006473,6.726231 C10.5006473,6.46833197 10.3539339,6.23790574 10.0609388,6.03466462 C9.76794362,5.83156734 9.4342427,5.7300187 9.05911684,5.7300187 C8.65277844,5.7300187 8.31691998,5.82380016 8.05125378,6.01136309 C7.79335475,6.19878218 7.45749628,6.55822985 7.04339071,7.08941842 C6.97305461,7.18319988 6.87538956,7.23023445 6.75039555,7.23023445 C6.65661409,7.23023445 6.5823944,7.20678909 6.52773649,7.16004219 L4.98091768,5.9882054 C4.80126576,5.8475332 4.77005322,5.68355948 4.88713621,5.49599655 C5.8872321,3.8319509 7.33638587,2.99985616 9.23474133,2.99985616 C9.91465695,2.99985616 10.5787505,3.16009014 11.2271659,3.48041425 C11.8755813,3.80059452 12.4165508,4.25382366 12.850362,4.83981397 C13.2835978,5.42566045 13.5006473,6.06242509 13.5006473,6.74996404 C13.5002158,7.09373352 13.4511675,7.41003021 13.3537901,7.69914177 L13.3537901,7.69914177 Z" />
										</g>
									</svg>
								</div>
								<span>{ t('panel_menu_help') }</span>
							</Link>
						</li>
						<li className="menu-option menu-about">
							<Link to="/about" onClick={this.props.toggleDropdown}>
								<div className="menu-icon-container">
									<svg width="17" height="21" viewBox="0 0 17 21">
										<g className="about-icon" fill="none" fillRule="evenodd">
											<path d="M8.5 2l7.36 4.25v8.5L8.5 19l-7.36-4.25v-8.5z" />
											<text transform="translate(0 2)">
												<tspan x="7" y="12">i</tspan>
											</text>
										</g>
									</svg>
								</div>
								<span>{ t('panel_menu_about') }</span>
							</Link>
						</li>
						{loggedIn ? (
							<li className="menu-option">
								<Link to="/subscription" onClick={this.props.toggleDropdown}>
									<this.SupporterMenuItemBase/>
								</Link>
							</li>	
						) : (
							<li className="menu-option-base">
								<this.SupporterMenuItemBase/>
							</li>	
						)}
					</ul>
					<div className="row account-info">
						<div onClick={this.clickSignedInAs} className={`${!loggedIn ? 'hide' : ''} menu-option signed-in-as small-12 columns`}>
							<svg width="17px" height="18px" viewBox="0 0 17 18">
								<g>
									<path className="menu-icon" d="M11.7415776,7.69057143 C12.6371552,6.81771429 13.0848707,5.76442857 13.0848707,4.53057143 C13.0848707,3.29685714 12.6371552,2.24357143 11.7415776,1.37057143 C10.8461466,0.497714286 9.76547414,0.0612857143 8.49985345,0.0612857143 C7.23423276,0.0612857143 6.15356034,0.497714286 5.25812931,1.37057143 C4.36255172,2.24357143 3.91483621,3.29685714 3.91483621,4.53057143 C3.91483621,5.76442857 4.36255172,6.81771429 5.25812931,7.69057143 C6.1537069,8.56342857 7.23423276,9 8.49985345,9 C9.76576724,9 10.8462931,8.56342857 11.7415776,7.69057143 Z" />
									<path className="menu-icon" d="M16.8637069,13.7195714 C16.8357155,13.3277143 16.7800259,12.9048571 16.6964914,12.4508571 C16.6129569,11.9968571 16.5072931,11.576 16.3799397,11.188 C16.2525862,10.8001429 16.0814138,10.4218571 15.8664224,10.0532857 C15.6515776,9.68471429 15.4047845,9.37042857 15.1260431,9.11042857 C14.8473017,8.85042857 14.5071552,8.643 14.1053103,8.48785714 C13.7031724,8.33271429 13.2594138,8.255 12.7738879,8.255 C12.7022241,8.255 12.5350086,8.33842857 12.2723879,8.50528571 C12.0097672,8.67214286 11.7132931,8.85842857 11.3829655,9.064 C11.0526379,9.26942857 10.6226552,9.45585714 10.0934569,9.62242857 C9.56411207,9.78928571 9.03286207,9.87271429 8.49941379,9.87271429 C7.96611207,9.87271429 7.43486207,9.78928571 6.90551724,9.62242857 C6.37631897,9.45585714 5.94633621,9.26942857 5.61600862,9.064 C5.28568103,8.85842857 4.9892069,8.67214286 4.72658621,8.50528571 C4.46381897,8.33842857 4.29675,8.255 4.22508621,8.255 C3.73956034,8.255 3.29580172,8.33271429 2.89381034,8.48785714 C2.49181897,8.643 2.15152586,8.85057143 1.87293103,9.11042857 C1.59433621,9.37042857 1.3475431,9.68471429 1.13269828,10.0532857 C0.917853448,10.4218571 0.746681034,10.8002857 0.619327586,11.188 C0.491974138,11.576 0.386456897,11.9968571 0.302922414,12.4508571 C0.219241379,12.9048571 0.163551724,13.3275714 0.135706897,13.7195714 C0.107862069,14.1115714 0.0939396552,14.513 0.0939396552,14.9242857 C0.0939396552,15.8552857 0.384551724,16.5905714 0.96562931,17.1298571 C1.5467069,17.669 2.31888793,17.9385714 3.28202586,17.9385714 L13.717681,17.9385714 C14.680819,17.9385714 15.4528534,17.669 16.0340776,17.1298571 C16.6153017,16.5905714 16.9057672,15.8554286 16.9057672,14.9242857 C16.9057672,14.513 16.8918448,14.1114286 16.8637069,13.7195714 L16.8637069,13.7195714 Z" />
								</g>
							</svg>
							<span title={email} >{ email }</span>
						</div>
						<div onClick={this.clickSignIn} className={`${loggedIn ? 'hide' : ''} menu-option menu-signin small-12 columns`}>
							<span>{ t('panel_menu_signin') }</span>
						</div>
						<div onClick={this.clickSignOut} className={`${!loggedIn ? 'hide' : ''} menu-option menu-signout small-12 columns`}>
							<span>{ t('panel_menu_signout') }</span>
						</div>
					</div>
				</div>
			</ClickOutside>
		);
	}
}

export default HeaderMenu;
