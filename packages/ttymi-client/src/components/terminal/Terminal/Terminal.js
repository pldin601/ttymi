import React, { Component } from 'react';
import Xterm from '../../../lib/Xterm';
import attach from '../../../lib/attach';
import { connect } from '../../../lib/ws';
import styles from './Terminal.css';

export default class Terminal extends Component {
  openTerminal() {
    const container = this.refs['xterm'];

    const xterm = new Xterm({
      cursorBlink: true,
      fontFamily: 'Monaco, monospace',
    });

    xterm.open(container);
    xterm.focus();
    xterm.fit();

    window.addEventListener('resize', () => xterm.fit());

    return xterm;
  }

  async componentDidMount() {
    const { host, username, password } = this.props;
    this.ws = await connect(host, username, password);

    const xterm = this.openTerminal();

    try {
      const exitData = await attach(xterm, this.ws);
      this.props.onDisconnect(exitData);
    } catch (error) {
      this.props.onError(error);
    }
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return <div className={styles['terminal-wrap']} ref="xterm" />;
  }
}

Terminal.defaultProps = {
  onDisconnect: () => {},
  onError: () => {},
};
