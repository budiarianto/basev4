import React from 'react';
import ReactDOM from 'react-dom';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

export const ToolbarImport =React.createClass({
	render (){
		return(
				<center>
			      <button type="button" className="btn btn-warning" id="btnFile">
			      	<div className="form-inline hidden-xs"><span className="glyphicon glyphicon-open-file form-inline"></span>&nbsp; Choose file to import</div>
			      	<div className="visible-xs"><span className="glyphicon glyphicon-open-file form-inline"></span></div>
			      </button>
			      <button type="button" className="btn btn-success btn-loading" id="btnRetrieve">
			      <div className="hidden-xs"><span className="glyphicon glyphicon-transfer form-inline"></span>&nbsp; Retrieve data</div>
			        
			       <div className="spinner">
			         <div className="bounce1"></div>
			         <div className="bounce2"></div>
			         <div className="bounce3"></div>
			        </div>
			        <div className="visible-xs"><span className="glyphicon glyphicon-transfer form-inline"></span></div>
			      </button>
			      <button type="button" className="btn btn-primary btn-loading" id="btnImport">
			      <div className="hidden-xs"><span className="glyphicon glyphicon-floppy-saved form-inline"></span>&nbsp; Import data</div>
			       <div className="spinner">
			         <div className="bounce1"></div>
			         <div className="bounce2"></div>
			         <div className="bounce3"></div>
			        </div>
			        <div className="visible-xs"><span className="glyphicon glyphicon-floppy-saved form-inline"></span></div>
			      </button>
			       <button type="button" className="btn btn-danger btn-loading" id="btnClear">
			       	<div className="form-inline hidden-xs"><span className="glyphicon glyphicon-trash form-inline"></span>&nbsp;Clear data</div>
			        <div className="spinner">
			         <div className="bounce1"></div>
			         <div className="bounce2"></div>
			         <div className="bounce3"></div>
			        </div>
			        <div className="visible-xs"><span className="glyphicon glyphicon-trash form-inline"></span></div>
			      </button>
			    </center>
			);
	}
});


