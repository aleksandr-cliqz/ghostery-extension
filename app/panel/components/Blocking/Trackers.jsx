/**
 * Trackers Component
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
import Tracker from './Tracker';
import GlobalTracker from './GlobalTracker';
/**
 * @class Implement Trackers component which represents a container for trackers
 * in both Blocking view and Global Blocking subview of Settings.
 * @memberOf BlockingComponents
 */
class Trackers extends React.Component {
	/**
	 * React hook used to optimise re-rendering of the list of trackers.
	 * @param  {Object} nextProps	changed props
	 * @param  {Object} nextState   changed state
	 * @return {boolean}            true means proceed with rendering
	 */
	shouldComponentUpdate(nextProps, nextState) {
		const { trackers } = nextProps;
		if (!trackers || trackers.length === 0) {
			return false;
		}
		return true;
	}
	/**
	* Render the list of Tracker components in Blocking view or GlobalTracker components in Global Blocking view.
	* @return {ReactComponent}   ReactComponent instance
	*/
	render() {
		const { trackers } = this.props;
		let trackerList;
		if (this.props.globalBlocking) {
			const trackersToShow = [];
			trackers.forEach((tracker) => {
				if (tracker.shouldShow) {
					trackersToShow.push(tracker);
				}
			});
			trackerList = trackersToShow.map((tracker, index) => (
				<GlobalTracker
					index={index}
					count={this.props.trackers.length}
					tracker={tracker}
					key={tracker.id}
					cat_id={this.props.cat_id}
					actions={this.props.actions}
					showToast={this.props.showToast}
					language={this.props.language}
				/>
			));
		} else {
			trackerList = trackers.map((tracker, index) => (
				<Tracker
					tracker={tracker}
					key={tracker.id}
					cat_id={this.props.cat_id}
					actions={this.props.actions}
					show_tracker_urls={this.props.show_tracker_urls}
					sitePolicy={this.props.sitePolicy}
					paused_blocking={this.props.paused_blocking}
					language={this.props.language}
					smartBlockActive={this.props.smartBlockActive}
					smartBlock={this.props.smartBlock}
				/>
			));
		}
		return <div className="trackers-list">{ trackerList }</div>;
	}
}

Trackers.defaultProps = {
	trackers: [],
};

export default Trackers;
