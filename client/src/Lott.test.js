import React from 'react';
import ReactDOM from 'react-dom';
import Lott from './Lott';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Lott />, div);
  ReactDOM.unmountComponentAtNode(div);
});
