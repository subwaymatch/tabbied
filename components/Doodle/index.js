'use client';

import React from 'react';
import 'css-doodle';

class Doodle extends React.Component {
  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    const element = this.props.doodleRef.current;

    if (!element) {
      return;
    }

    // css-doodle >= 0.5 no longer re-reads the element's text content on a
    // bare `update()`, so pass the current doodle source explicitly to make
    // sure the grid is regenerated when the rules, palette, or seed change.
    element.update(this.props.doodleCode);
  }

  render() {
    const { seed = '0000', name, styleCode, doodleCode, doodleRef } = this.props;

    return (
      <div>
        <style>
          {`
          css-doodle#${name} {
            ${styleCode}
          }
        `}
        </style>

        <css-doodle id={name} seed={seed} use="var(--rule)" ref={doodleRef}>
          {`
            ${doodleCode}
          `}
        </css-doodle>
      </div>
    );
  }
}

export default Doodle;
