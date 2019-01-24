import React from 'react';
import ReactDOM from 'react-dom';
import Tick from './Tick';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tick />, div);
  ReactDOM.unmountComponentAtNode(div);
});
