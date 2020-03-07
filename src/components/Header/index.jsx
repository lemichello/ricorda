import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading
} from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';

export const Header = function() {
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Ricorda</NavbarHeading>
        <NavbarDivider />
        <Link to={'/new-words'} style={{ textDecoration: 'none' }}>
          <Button className={Classes.MINIMAL} icon="manual" text="New Words" />
        </Link>
        <Link to={'/today-words'} style={{ textDecoration: 'none' }}>
          <Button
            className={Classes.MINIMAL}
            icon="star"
            text="Today's words"
          />
        </Link>
      </NavbarGroup>
    </Navbar>
  );
};
