import React, { Component } from "react";
import NavHelper from "./NavHelper";

class TransitionController extends Component {
  constructor(props) {
    super(props);

    //active: if transition is happening right now
    //index and lastIndex - indexes of current and previous sections
    this.defaultState = { active: false, index: 0, lastIndex: null };
    this.state = Object.assign({}, this.defaultState);

    //points to actual components in DOM
    this.lastSection = null;
    this.activeSection = null;
  }

  componentDidMount() {
    //scroll & touch events defined in navHelper

    this.startInitialTransition();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sections !== nextProps.sections) {
      this.resetState();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.sections !== prevProps.sections) {
      this.startInitialTransition();
    }
  }

  startInitialTransition() {
    const { sections } = this.props;

    if (this.activeSection) {
      this.activeSection.enterTransition(
        sections[this.state.index].time / 1000
      );
    }
  }

  resetState() {
    this.setState(this.defaultState);
  }

  transitionSection = direction => {
    const { sections } = this.props;
    const index = this.state.index;

    //don't allow prev on first and next on last
    if (direction === "prev" && index === 0) return;
    if (direction === "next" && index === sections.length - 1) return;

    direction === "next"
      ? this.transitionToIndex(index + 1)
      : this.transitionToIndex(index - 1);
  };

  transitionToIndex = newIndex => {
    const { sections, transitionThree } = this.props;
    let lastIndex = this.state.index;

    this.setState({ index: newIndex, lastIndex: lastIndex });
    const cam = sections[newIndex].coords.cam;
    const target = sections[newIndex].coords.target;
    const time = sections[newIndex].time;
    const background = sections[newIndex].background;

    transitionThree(
      cam,
      target,
      time,
      background,
      this.startTransition,
      this.finishTransition
    );
  };

  startTransition = () => {
    const { sections } = this.props;

    this.setState({ active: true });
    if (this.activeSection.enterTransition) {
      this.activeSection.enterTransition(
        sections[this.state.index].time / 1000
      );
    }

    if (this.lastSection && this.lastSection.exitTransition) {
      this.lastSection.exitTransition(
        sections[this.state.lastIndex].time / 1000
      );
    }
  };

  finishTransition = () => {
    this.setState({ active: false });
  };

  render = () => {
    const { sections } = this.props;

    if (sections.length === 0) return null;

    let LastSection =
      this.state.lastIndex !== null
        ? sections[this.state.lastIndex].component
        : sections[this.state.index].component; //render first slide two times
    let ActiveSection = sections[this.state.index].component;

    return (
      <div className="page">
        <LastSection ref={el => (this.lastSection = el)} />
        <ActiveSection ref={el => (this.activeSection = el)} />

        <NavHelper
          currentIndex={this.state.index}
          sections={sections}
          transitionToIndex={this.transitionToIndex}
          transitionSection={this.transitionSection}
          active={this.state.active}
        />
      </div>
    );
  };
}

export default TransitionController;
