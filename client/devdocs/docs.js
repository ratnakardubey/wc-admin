/** @format */
/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import marked from 'marked';
import { Parser } from 'html-to-react';

const htmlToReactParser = new Parser();

class Docs extends Component {
	state = {
		readme: null,
	};

	componentDidMount() {
		this.getReadme();
	}

	getReadme() {
		const { filePath, docPath } = this.props;
		const readme = require( `../../docs/components/${ docPath }/${ filePath }.md` );
		if ( ! readme ) {
			return;
		}
		const html = marked( readme );
		this.setState( {
			readme: htmlToReactParser.parse( html ),
		} );
	}

	render() {
		const { readme } = this.state;
		if ( ! readme ) {
			return null;
		}
		return <div className="woocommerce-devdocs__docs">{ readme }</div>;
	}
}

Docs.defaultProps = {
	docPath: 'packages',
};

export default Docs;
