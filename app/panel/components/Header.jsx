/**
 * Header Component
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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import HeaderMenu from './HeaderMenu';
import { sendMessage, sendMessageInPromise } from '../utils/msg';
import { log } from '../../../src/utils/common';

/**
 * @class Implements header component which is common to all panel views
 * @memberof PanelClasses
 */
class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
		};

		// Event Bindings
		this.clickSimpleTab = this.clickSimpleTab.bind(this);
		this.clickDetailedTab = this.clickDetailedTab.bind(this);
		this.toggleExpert = this.toggleExpert.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}

	/**
	 * Handles clicking on the Simple View tab
	 */
	clickSimpleTab() {
		if (this.props.is_expert) {
			this.toggleExpert();
		}
	}

	/**
	 * Handles clicking on the Detailed View tab
	 */
	clickDetailedTab() {
		if (!this.props.is_expert) {
			this.toggleExpert();
		}
	}

	/**
	 * Toggle between Simple and Detailed Views.
	 */
	toggleExpert() {
		this.props.actions.toggleExpert();
		if (this.props.is_expert) {
			this.props.history.push('/');
		} else {
			this.props.history.push('/detail');
		}
	}

	/**
	 * Handles toggling the drop-down pane open/closed
	 */
	toggleDropdown() {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	}

	handleSignin = () => {
		sendMessage('ping', 'sign_in');
		this.props.history.push('/login');
	}

	handleSendValidateAccountEmail = () => {
		const { user } = this.props;
		sendMessageInPromise('account.sendValidateAccountEmail').then((success) => {
			if (success) {
				this.props.actions.showNotification({
					classes: 'success',
					text: t('panel_email_verification_sent', user && user.email),
				});
			} else {
				this.props.actions.showNotification({
					classes: 'alert',
					text: t('server_error_message'),
				});
			}
		}).catch((err) => {
			log('sendVerificationEmail Error', err);
			this.props.actions.showNotification({
				classes: 'alert',
				text: t('server_error_message'),
			});
		});
	}

	generateLink = () => {
		const { loggedIn, user } = this.props;
		let text = '';
		let handleOnClick = null;
		if (!loggedIn) {
			text = t('panel_header_sign_in');
			handleOnClick = this.handleSignin;
		} else if (loggedIn && user && !user.emailValidated) {
			text = t('panel_header_verify_account');
			handleOnClick = this.handleSendValidateAccountEmail;
		}

		return (
			<div onClick={handleOnClick} className="header-helper-text">
				{text}
			</div>
		);
	}

	/**
	* React's required render function. Returns JSX
	* @return {JSX} JSX for rendering the Header Component of the panel
	*/
	render() {
		const { pathname } = this.props.location;
		const showTabs = pathname === '/' || pathname.startsWith('/detail');
		const headerLogoClasses = ClassNames('header-logo', {
			'show-back-arrow': (pathname !== '/' && !pathname.startsWith('/detail')),
		});
		const tabSimpleClassNames = ClassNames('header-tab', {
			active: !this.props.is_expert,
		});
		const tabDetailedClassNames = ClassNames('header-tab', {
			active: this.props.is_expert,
		});
		const { loggedIn, user } = this.props;
		const rightLink = this.generateLink();

		return (
			<header id="ghostery-header">
				{ showTabs && (
					<div className="header-tab-group flex-container align-bottom">
						<div className={tabSimpleClassNames} onClick={this.clickSimpleTab}>
							<span className="header-tab-text">
								{t('panel_header_simple_view')}
							</span>
						</div>
						<div className={tabDetailedClassNames} onClick={this.clickDetailedTab}>
							<span className="header-tab-text">
								{t('panel_header_detailed_view')}
							</span>
						</div>
					</div>
				)}
				<div className="top-bar">
					<div className="top-bar-left">
						<Link to={(this.props.is_expert ? '/detail/blocking' : '/')} className={headerLogoClasses} >
							<img className="back-arrow" src="/app/images/panel/back_arrow_icon.png" />
						</Link>
					</div>
					<div className="top-bar-right">
						<div className="row align-middle collapse">
							<div className="columns shrink">
								{rightLink}
							</div>
							<div className="columns shrink">
								<Link to={this.props.logged_in ? "/subscription" : "/subscribe"}>
									<svg width="29px" height="20px" viewBox="0 0 29 20" className="header-badge">
									    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									        <g transform="translate(-552.000000, -70.000000)" fill="#FFFFFF">
									            <g transform="translate(552.000000, 70.000000)" className={this.props.logged_in ? "" : "disabled-header-badge"} >
									                <g fillRule="nonzero">
									                    <path d="M29,5.00241085 L23.2873222,5.00241085 C23.2319,4.60870956 23.1194444,4.22116491 22.8732667,3.88125325 C22.4208667,3.25619169 21.6871667,3.00441728 21.0395,2.78245399 C20.6496111,2.64895199 20.2816333,2.52257873 20.0335222,2.3411197 C19.7908889,2.16354908 19.5611444,1.85344855 19.3175444,1.52520212 C18.9060667,0.96980786 18.4398111,0.340533853 17.6990222,0.0988044971 C16.9859444,-0.133851907 16.2545,0.0919997834 15.6097333,0.291280687 C15.2059889,0.416033772 14.8251222,0.53365811 14.5003222,0.53365811 C14.1758444,0.53365811 13.7946556,0.416033772 13.3909111,0.291280687 C12.7458222,0.0919997834 12.0140556,-0.133851907 11.3016222,0.0984804631 C10.5605111,0.340533853 10.0936111,0.970131894 9.68213333,1.52552615 C9.43917778,1.85344855 9.20943333,2.16354908 8.96712222,2.34079567 C8.71901111,2.5222547 8.35103333,2.64862796 7.96114444,2.78212996 C7.3138,3.00409324 6.57945556,3.25586765 6.12737778,3.88060518 C5.8812,4.22051684 5.76874444,4.60838552 5.71332222,5.00176278 L0,5.00176278 L1.86631111,9.99998707 L0,14.9972392 L5.713,14.9972392 C5.7681,15.3909405 5.88087778,15.7784852 6.12673333,16.1187209 C6.57913333,16.7434584 7.31315556,16.9952328 7.9605,17.2171961 C8.35038889,17.3510221 8.71868889,17.4770714 8.9668,17.6585304 C9.20878889,17.836101 9.43853333,18.1458775 9.68181111,18.4741239 C10.0932889,19.0295182 10.5601889,19.6591162 11.3013,19.9011696 C12.0127667,20.133502 12.7451778,19.9076503 13.3905889,19.7086934 C13.7943333,19.5842644 14.1752,19.466316 14.5,19.466316 C14.8248,19.466316 15.2056667,19.5839404 15.6094111,19.7086934 C16.0598778,19.8480281 16.5522333,20 17.0510333,20 C17.2666,20 17.4834556,19.971485 17.6983778,19.9011696 C18.4394889,19.6594403 18.9057444,19.0301663 19.3172222,18.474772 C19.5605,18.1465256 19.7902444,17.8364251 20.0332,17.6588544 C20.2813111,17.4773954 20.6492889,17.3510221 21.0391778,17.2175201 C21.6868444,16.9955569 22.4208667,16.7437824 22.8729444,16.1187209 C23.1191222,15.7784852 23.2315778,15.3909405 23.2866778,14.9975633 L29,14.9975633 L27.1336889,9.99998707 L29,5.00241085 Z M1.86663333,13.6972149 L3.24767778,9.99998707 L1.86663333,6.30275925 L5.64694444,6.30275925 C5.63727778,6.59082547 5.61504444,6.85750544 5.54512222,7.07396014 C5.45554444,7.35165727 5.23675556,7.6617578 5.0054,7.99032827 C4.60455556,8.55868388 4.15022222,9.20351152 4.15022222,9.99998707 C4.15022222,10.7967866 4.60455556,11.4409662 5.0054,12.0096459 C5.23675556,12.3378923 5.45554444,12.6483169 5.54512222,12.926014 C5.61504444,13.1424687 5.63727778,13.4091487 5.64694444,13.6972149 L1.86663333,13.6972149 Z M22.9402889,11.257563 C22.6628556,11.6512643 22.3757556,12.058251 22.2252778,12.5245359 C22.0683556,13.0102628 22.0603,13.5222365 22.0522444,14.0176845 C22.0435444,14.5575251 22.0351667,15.0675546 21.8279778,15.3540007 C21.6166,15.6462793 21.1335889,15.8118607 20.6225444,15.9871631 C20.1585444,16.1462638 19.6790778,16.310549 19.2727556,16.6080122 C18.8715889,16.901587 18.5712778,17.3066295 18.2809556,17.6980625 C17.9558333,18.1364805 17.6490778,18.550596 17.2991444,18.6646559 C16.9746667,18.770291 16.4955222,18.6225315 15.9893111,18.4660231 C15.5121,18.3185876 15.0187778,18.1662917 14.5,18.1662917 C13.9815444,18.1662917 13.4879,18.3185876 13.0110111,18.4660231 C12.5035111,18.6225315 12.0246889,18.7709391 11.7002111,18.6646559 C11.3509222,18.550596 11.0435222,18.1361565 10.7180778,17.6974145 C10.4280778,17.3059814 10.1280889,16.901263 9.72724444,16.6080122 C9.32092222,16.310549 8.84113333,16.1462638 8.37745556,15.9871631 C7.86608889,15.8118607 7.38307778,15.6462793 7.1717,15.3540007 C6.96418889,15.0672306 6.95613333,14.5572011 6.94743333,14.0173605 C6.9397,13.5222365 6.93132222,13.0102628 6.77472222,12.5248599 C6.62424444,12.058575 6.33714444,11.6515883 6.05971111,11.258211 C5.74264444,10.8081278 5.44297778,10.3829952 5.44297778,10.0003111 C5.44297778,9.61795099 5.74264444,9.19249436 6.05971111,8.74241115 C6.33714444,8.34903389 6.62424444,7.9420472 6.77472222,7.47576229 C6.93132222,6.99035938 6.93937778,6.47870971 6.94775556,5.98358577 C6.95613333,5.44342111 6.96483333,4.93339161 7.17202222,4.64662153 C7.3834,4.35434287 7.86641111,4.18876151 8.37777778,4.01345912 C8.84145556,3.85435843 9.32092222,3.6900732 9.72724444,3.39261 C10.1280889,3.09935924 10.4280778,2.69431675 10.7180778,2.30320772 C11.0435222,1.8644657 11.3506,1.45002623 11.7002111,1.33596627 C11.7765778,1.31101565 11.8616444,1.30032253 11.9531556,1.30032253 C12.2515333,1.30032253 12.6230556,1.41503056 13.0110111,1.53492314 C13.4882222,1.6823586 13.9815444,1.83465458 14.5003222,1.83465458 C15.0187778,1.83465458 15.5124222,1.6823586 15.9896333,1.53492314 C16.4971333,1.37841472 16.9756333,1.23065522 17.2997889,1.3362903 C17.6490778,1.45035027 17.9561556,1.86478974 18.2812778,2.30288369 C18.5716,2.69464078 18.8719111,3.09968327 19.2730778,3.39293403 C19.6794,3.6900732 20.1588667,3.85468246 20.6228667,4.01378315 C21.1339111,4.18908554 21.6169222,4.35466691 21.8283,4.64694557 C22.0361333,4.93371565 22.0441889,5.44342111 22.0525667,5.98326174 C22.0603,6.47838567 22.0686778,6.99035938 22.2256,7.47576229 C22.3760778,7.94237124 22.6631778,8.34935793 22.9406111,8.74305922 C23.2576778,9.1928184 23.5573444,9.61795099 23.5573444,10.0003111 C23.5570222,10.3823472 23.2573556,10.8074798 22.9402889,11.257563 Z M27.1333667,13.6972149 L23.3530556,13.6972149 C23.3630444,13.4091487 23.3849556,13.1424687 23.4548778,12.926014 C23.5444556,12.6483169 23.7632444,12.3378923 23.9949222,12.0093218 C24.3954444,11.4409662 24.8497778,10.7964626 24.8497778,9.99998707 C24.8497778,9.20351152 24.3954444,8.55933195 23.9949222,7.99097633 C23.7632444,7.66240587 23.5444556,7.35230534 23.4548778,7.07396014 C23.3849556,6.85750544 23.3627222,6.59082547 23.3530556,6.30275925 L27.1330444,6.30275925 L25.7523222,9.99998707 L27.1333667,13.6972149 Z" id="Shape"></path>
									                    <path d="M14.5001624,3.20987654 C10.7415281,3.20987654 7.68376068,6.25574995 7.68376068,10.0001618 C7.68376068,13.7442501 10.7415281,16.7901235 14.5001624,16.7901235 C18.2584719,16.7901235 21.3162393,13.7442501 21.3162393,10.0001618 C21.3162393,6.2560735 18.2584719,3.20987654 14.5001624,3.20987654 Z M14.5001624,15.680033 C11.3563293,15.680033 8.79871719,13.1320987 8.79871719,10.0001618 C8.79871719,6.86822481 11.3563293,4.32029056 14.5001624,4.32029056 C17.6436707,4.32029056 20.2012828,6.86822481 20.2012828,10.0001618 C20.2012828,13.1320987 17.6439955,15.680033 14.5001624,15.680033 Z" id="Shape"></path>
									                </g>
									                <path d="M17.2360046,12.2028073 C16.9611165,11.5670619 16.9138127,11.0284159 16.9063983,10.8167658 L16.9063983,9.07533679 C16.9063983,7.7450186 15.8287923,6.66666667 14.4995792,6.66666667 C13.1702178,6.66666667 12.0925747,7.7450186 12.0925747,9.07533679 L12.0925747,10.8419397 C12.0822687,11.0696027 12.0282549,11.5918194 11.7640435,12.2028073 C11.4087834,13.0238175 11.7027265,12.9259988 11.9660853,12.8584268 C12.22937,12.7911575 12.8173674,12.5274939 13.0010958,12.852332 C13.1846759,13.1769808 13.337857,13.4590044 13.7665194,13.2751023 C14.1952189,13.0913895 14.3972237,13.0301015 14.4584294,13.0301015 L14.5416558,13.0301015 C14.6028244,13.0301015 14.8049034,13.0913895 15.2335287,13.2751023 C15.6622282,13.4590044 15.8153722,13.1769808 15.9990635,12.852332 C16.1826806,12.5274939 16.770641,12.7911575 17.0339998,12.8584268 C17.2973215,12.9259988 17.5911534,13.0238175 17.2360046,12.2028073 M13.7566582,7.98006344 C14.0159021,7.98006344 14.2260998,8.31285119 14.2260998,8.72346986 C14.2260998,9.13412639 14.0159021,9.46698985 13.7566582,9.46698985 C13.4974144,9.46698985 13.2871797,9.13412639 13.2871797,8.72346986 C13.2871797,8.31285119 13.4974144,7.98006344 13.7566582,7.98006344 M14.4995792,10.9516449 C13.9283012,10.9516449 13.4474044,10.3889985 13.3024904,9.76290634 C13.5823462,10.1480104 14.0143821,10.395434 14.4995792,10.395434 C14.9847021,10.395434 15.4167381,10.1480104 15.6966309,9.76290634 C15.5517169,10.3889985 15.070746,10.9516449 14.4995792,10.9516449 M15.2425372,9.46698985 C14.9830709,9.46698985 14.7729845,9.13412639 14.7729845,8.72346986 C14.7729845,8.31285119 14.9830709,7.98006344 15.2425372,7.98006344 C15.5018922,7.98006344 15.7119045,8.31285119 15.7119045,8.72346986 C15.7119045,9.13412639 15.5018922,9.46698985 15.2425372,9.46698985" id="Fill-3"></path>
									            </g>
									        </g>
									    </g>
									</svg>								
								</Link>
							</div>				
							<div
								className="header-kebab shrink columns"
								onClick={this.toggleDropdown}
								ref={(node) => { this.kebab = node; }}
							/>
						</div>
						{ this.state.dropdownOpen &&
							<HeaderMenu
								loggedIn={loggedIn}
								email={user && user.email}
								language={this.props.language}
								tab_id={this.props.tab_id}
								history={this.props.history}
								actions={this.props.actions}
								toggleDropdown={this.toggleDropdown}
								kebab={this.kebab}
							/>
						}
					</div>
				</div>
			</header>
		);
	}
}

export default Header;
