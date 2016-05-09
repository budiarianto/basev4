/* ASLI
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { App } from '../../ui/layouts/app';
import { Documents } from '../../ui/pages/documents';
import { Index } from '../../ui/pages/index';
import { Login } from '../../ui/pages/login';
import { NotFound } from '../../ui/pages/not-found';
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { Signup } from '../../ui/pages/signup';

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.user()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } onEnter={ requireAuth } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ requireAuth } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
*/
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { App } from '../../ui/layouts/app';
import { Documents } from '../../ui/pages/documents';
//====== NAVBAR
import { Booking } from '../../ui/pages/bookingList';
import { AddBooking } from '../../ui/components/add-booking';

import { HistoryList } from '../../ui/pages/historyList';
import { City } from '../../ui/pages/cityList';
import { AddCity } from '../../ui/components/add-city';

import { Helipad } from '../../ui/pages/helipadList';
import { AddHelipad } from '../../ui/components/add-helipad';

import { FareList } from '../../ui/pages/fareList';
import { AddFare } from '../../ui/components/add-fare';

//====== NAVBAR DROPDOWN
import { Settlement } from '../../ui/pages/importSettlement';
import { ReconcileList } from '../../ui/pages/reconcile';
import { SettlementList } from '../../ui/pages/settlement';


//====== END NAVBAR
import { UserManagement } from '../../ui/pages/userManagement';
import { MemberList } from '../../ui/pages/memberList';
import { AddMember } from '../../ui/components/add-member';

import { SupportList } from '../../ui/pages/supportList';
import { AddSupport } from '../../ui/components/add-support';

import { Index } from '../../ui/pages/index';
import { Login } from '../../ui/pages/login';
import { NotFound } from '../../ui/pages/not-found';
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { Signup } from '../../ui/pages/signup';

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.user()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } onEnter={ requireAuth } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ requireAuth } />
        <Route name="Booking" path="/bookingList" component={ Booking } onEnter={ requireAuth } />
        <Route name="AddBooking" path="/addBooking" component={ AddBooking } onEnter={ requireAuth } />
        
        <Route name="HistoryList" path="/historyList" component={ HistoryList } onEnter={ requireAuth } />

        <Route name="City" path="/cityList" component={ City } onEnter={ requireAuth } />
        <Route name="AddCity" path="/addCity" component={ AddCity } onEnter={ requireAuth } />
        
        <Route name="Helipad" path="/helipadList" component={ Helipad } onEnter={ requireAuth } />
        <Route name="AddHelipad" path="/addHelipad" component={ AddHelipad } onEnter={ requireAuth } />
        
        <Route name="FareList" path="/fareList" component={ FareList } onEnter={ requireAuth } />
        <Route name="AddFare" path="/addFare" component={ AddFare } onEnter={ requireAuth } />
        
        <Route name="Settlement" path="/importSettlement" component={ Settlement } onEnter={ requireAuth } />
        <Route name="ReconcileList" path="/reconcile" component={ ReconcileList } onEnter={ requireAuth } />
        <Route name="SettlementList" path="/settlement" component={ SettlementList } onEnter={ requireAuth } />

        <Route name="UserManagement" path="/userManagement" component={ UserManagement } onEnter={ requireAuth } />
        <Route name="MemberList" path="/memberList" component={ MemberList } onEnter={ requireAuth } />
        <Route name="AddMember" path="/addMember" component={ AddMember } onEnter={ requireAuth } />
        
        <Route name="SupportList" path="/ticketSupport" component={ SupportList } onEnter={ requireAuth } />
        <Route name="AddSupport" path="/addSupport" component={ AddSupport } onEnter={ requireAuth } />

        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
