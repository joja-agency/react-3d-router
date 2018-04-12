import React, { Component } from "react";
import arrow from "../../assets/img/down-arrow.svg";

class NavHelper extends Component {
  componentDidMount() {
    window.addEventListener("wheel", this.handleScroll);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
  }
  componentWillUnmount() {
    window.removeEventListener("wheel", this.handleScroll);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }

  handleScroll = e => {
    const { transitionSection, active } = this.props;

    if (active) return;

    if (e.deltaY > 2) {
      transitionSection("next");
    } else if (e.deltaY < -2) {
      transitionSection("prev");
    }
  };

  handleTouchStart = e => {
    this.lastTouchPos = e.touches[0].clientY;
  };

  handleTouchEnd = e => {
    const { transitionSection } = this.props;

    let touchPos = e.changedTouches[0].clientY;
    let delta = this.lastTouchPos - touchPos;
    this.lastTouchPos = touchPos;

    if (delta > 5) {
      transitionSection("next");
    } else if (delta < -5) {
      transitionSection("prev");
    }

    let target = document.getElementsByClassName("section")[1];
    if (target) target.style.transform = "inherit";
  };

  handleTouchMove = e => {
    let target = document.getElementsByClassName("section")[1];
    if (target) {
      let touchobj = e.changedTouches[0];
      var dist = touchobj.clientY - this.lastTouchPos;
      target.style.transform = `translateY(${dist / 3}px)`;
    }
  };

  render = () => {
    const { currentIndex, sections, transitionToIndex } = this.props;

    if (sections.length < 2) return null; //don't show if only one slide

    //show arrow on first slide
    if (currentIndex === 0) {
      return (
        <div className="navIndicator">
          <div className="scrollDown" onClick={() => transitionToIndex(1)}>
            <div className="scrollText">scroll to start</div>
            <div className="arrow">
              <img src={arrow} alt="arrow" />
            </div>
          </div>
        </div>
      );
    } else {
      //show nav points

      return (
        <div className="navIndicator">
          {sections.map((el, i) => {
            let active = i === currentIndex ? "active" : "";
            return (
              <div
                key={i}
                className="navPointWrap"
                onClick={() => {
                  transitionToIndex(i);
                }}
              >
                <div className={`navPoint ${active}`} />
              </div>
            );
          })}
        </div>
      );
    }
  };
}

export default NavHelper;
