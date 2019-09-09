/**
 * Notification Component
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2019 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

import React, { Component } from 'react';

/**
 * @class Handles notifications for Rewards
 * @memberOf RewardsContentScript
 */
class Notification extends Component {
	constructor(props) {
		super(props);
		this.closeIcon = `url(${chrome.extension.getURL('app/images/rewards/white-x.svg')})`;
		this.state = {
			closed: false
		};

		this.closeNotification = this.closeNotification.bind(this);
	}

	closeNotification(confirm) {
		if (typeof this.props.data.closeCallback === 'function') {
			this.props.data.closeCallback(confirm);
		}
		this.setState({
			closed: true
		});
	}

	renderOptoutImage() {
		return (
			<div className="rewards-notification-optout-image-wrapper">
				<img
					src={chrome.extension.getURL('app/images/rewards/ghostery_O.png')}
				/>
			</div>
		);
	}

	renderOptoutLink() {
		return (
			<a
				href={this.props.data.textLink.href}
				target="_blank"
				rel="noopener noreferrer"
				onClick={() => this.props.data.textLink.callback()}
			>
				{this.props.data.textLink.text}
			</a>
		);
	}

	renderHeadline() {
		return (
			<div className="first-prompt-headline">
				{t('rewards_first_prompt_headline')}
			</div>
		);
	}

	renderLabels() {
		return (
			<div className="first-prompt-labels">
				<img src={chrome.extension.getURL('app/images/rewards/exclusive.svg')} />
				<span className="first-prompt-label">{t('rewards_exclusive')}</span>
				<img src={chrome.extension.getURL('app/images/rewards/best-offer.svg')} />
				<span className="first-prompt-label">{t('rewards_best_offer')}</span>
			</div>
		);
	}

	renderClose() {
		return (
			<div
				className="close"
				onClick={() => { this.closeNotification(); }}
				style={{ backgroundImage: this.closeIcon }}
			/>
		);
	}

	render() {
		return (
			<div>
				{!this.state.closed && (
					<div className="rewards-notification-container">
						<div className="rewards-notification-overlay" />
						<div className="rewards-popup-container">
							<div className={`rewards-notification ${this.props.data.type}`}>
								{this.props.data.type === 'first-prompt' && this.renderOptoutImage()}
								{this.props.data.type !== 'first-prompt' && this.renderClose()}
								<div className={`notification-text ${this.props.data.type}`}>
									{this.props.data.type === 'first-prompt' && this.renderLabels()}
									{this.props.data.type === 'first-prompt' && this.renderHeadline()}
									{this.props.data.message}
									{' '}
									{this.props.data.type === 'first-prompt' && this.renderOptoutLink()}
								</div>
								{this.props.data.buttons && (
									<div className={`notification-buttons ${this.props.data.type}`}>
										<button type="button" className="btn" onClick={() => { this.closeNotification(true); }}>
											{t('rewards_yes')}
										</button>
										<button type="button" className="btn" onClick={() => { this.closeNotification(false); }}>
											{t('rewards_no')}
										</button>
									</div>
								)}
								{this.props.data.textLink && this.props.data.type !== 'first-prompt'
									&& (
										<a
											className="notification-text"
											href={this.props.data.textLink.href}
											target="_blank"
											rel="noopener noreferrer"
											onClick={() => {
												if (this.props.data.textLink.callback) {
													this.props.data.textLink.callback();
												}
											}}
										>
											{this.props.data.textLink.text}
										</a>
									)
								}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default Notification;
