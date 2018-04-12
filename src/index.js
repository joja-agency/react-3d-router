import React, { Component } from "react";
import { withRouter } from "react-router";
import Three from "./Three";
import TransitionController from "./TransitionController";
import "./style.css";

// TODO:
// Reformat ComponentList, so that parent component nests children
// and remove coords, etc from parent component to use it's first child

let ThreeObject = {};
let components = [];

class React3dNavigation extends Component {
  constructor(props) {
    super(props);
    this.three = {};
    this.state = { sections: [] };
    components = props.components;
  }

  componentDidMount() {
    //assign the instance to global ref
    ThreeObject = this.three;

    //navigate to initial component
    transition(this.props.location.pathname);

    this.findChildrenByPath(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    this.findChildrenByPath(nextProps.location.pathname);
  }

  findChildrenByPath(path) {
    let component = findComponentByPath(path);
    if (component && component.children) {
      let components = component.children.map(childName => {
        return getComponent(childName);
      });
      this.setState({ sections: components });
    }
  }

  toggleDev() {
    let canvas = document.getElementById("canvasContainer");
    canvas.style.zIndex = canvas.style.zIndex > 0 ? -1 : 1;
  }

  render() {
    const { object3d, background, initialPos, devMode } = this.props;

    return (
      <div className="react3dnavigation">
        <TransitionController
          sections={this.state.sections}
          transitionThree={transitionThree}
        />

        <Three
          ref={el => (this.three = el)}
          object={object3d}
          background={background}
          initialPos={initialPos}
        />

        {devMode && (
          <div className="toggleThreeZ" onClick={this.toggleDev}>
            toggleZindex
          </div>
        )}
      </div>
    );
  }
}

export const transition = path => {
  const component = findComponentByPath(path);
  const cam = component.coords.cam;
  const target = component.coords.target;
  const time = component.time;
  const background = component.background;

  ThreeObject.setCamPosition(cam, target, time, background);
};

const findComponentByPath = path => {
  const key = Object.keys(components).find(
    key => components[key].path === path
  );
  return components[key];
};

export const setMovement = () => {
  ThreeObject.setMovement();
};

export const stopMovement = () => {
  ThreeObject.stopMovement();
};

//direct three.js transition for TransitionController
const transitionThree = (...args) => ThreeObject.setCamPosition(...args);

const getComponent = name => {
  return components[name] ? components[name] : null;
};


export default withRouter(React3dNavigation);