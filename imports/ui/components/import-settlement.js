import React from 'react';
import ReactDOM from 'react-dom';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { ToolbarImport } from '../components/toolbar-import';

export const ImportSettlement =React.createClass({
	render (){
		return(
			
			<div>
			<h3 classNameName="text-thin text-din">Import Settlement</h3>
		    	<form id="uploadForm">
				  <input type="file" accept=".csv" />
				   <input type="text" accept=".csv" />
			    </form>
			  <h4 className="text-thin text-din">Settlement imported data</h4>
			  <h4 className="text-thin text-din fileName"></h4>
			  <div className="clearfix"></div>
			            <ToolbarImport />
			  <div className="clearfix"></div>
			  <div className="gap-bottom-small"></div>
			  <div className="table-responsive">          
		          <table className="table">
		            <thead>
		              <tr>
		                <th>#</th>
		                <th>Order No</th>
		                <th>CC Number</th>
		                <th>Transaction Date</th>
		                <th>Settlement Date</th>
		                <th>Amount</th>
		                <th>Status</th>
		              </tr>
		            </thead>
		            <tbody>
		              {/*Import data will be placed here*/}
		            </tbody>
		            <div className="clearfix"></div>
		          </table>
		        </div>
		         <div className="clearfix"></div>
		         <ToolbarImport />
        	</div>
			);
	}
});


