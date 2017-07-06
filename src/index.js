import React from 'react';
import { render } from 'react-dom';
import { renderRoutes } from './routes';

//Styles
// import '../public/vendor/pickadatejs/themes/default';
// import '../public/vendor/pickadatejs/themes/default.date';

import main from './styles/main';
import styles from './styles/styles';

import 'font-awesome-sass-loader';

render(renderRoutes, document.getElementById('app'));
