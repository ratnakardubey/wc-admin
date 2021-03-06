/** @format */
/**
 * External dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { find, isEqual, partial } from 'lodash';
import PropTypes from 'prop-types';
import interpolateComponents from 'interpolate-components';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Search from '../../search';
import { textContent } from './utils';

class SearchFilter extends Component {
	constructor( { filter, config, query } ) {
		super( ...arguments );
		this.onSearchChange = this.onSearchChange.bind( this );
		this.state = {
			selected: [],
		};

		this.updateLabels = this.updateLabels.bind( this );

		if ( filter.value.length ) {
			config.input.getLabels( filter.value, query ).then( this.updateLabels );
		}
	}

	componentDidUpdate( prevProps ) {
		const { config, filter, query } = this.props;
		const { filter: prevFilter } = prevProps;

		if ( filter.value.length && ! isEqual( prevFilter, filter ) ) {
			config.input.getLabels( filter.value, query ).then( this.updateLabels );
		}
	}

	updateLabels( selected ) {
		const prevIds = this.state.selected.map( item => item.id );
		const ids = selected.map( item => item.id );

		if ( ! isEqual( ids.sort(), prevIds.sort() ) ) {
			this.setState( { selected } );
		}
	}

	onSearchChange( values ) {
		this.setState( {
			selected: values,
		} );
		const { filter, onFilterChange } = this.props;
		const idList = values.map( value => value.id ).join( ',' );
		onFilterChange( filter.key, 'value', idList );
	}

	getScreenReaderText( filter, config ) {
		const { selected } = this.state;

		if ( 0 === selected.length ) {
			return '';
		}

		const rule = find( config.rules, { value: filter.rule } ) || {};
		const filterStr = selected.map( item => item.label ).join( ', ' );

		return textContent( interpolateComponents( {
			mixedString: config.labels.title,
			components: {
				filter: <Fragment>{ filterStr }</Fragment>,
				rule: <Fragment>{ rule.label }</Fragment>,
			},
		} ) );
	}

	render() {
		const { className, config, filter, onFilterChange, isEnglish } = this.props;
		const { selected } = this.state;
		const { key, rule } = filter;
		const { input, labels, rules } = config;
		const children = interpolateComponents( {
			mixedString: labels.title,
			components: {
				title: <span className={ className } />,
				rule: (
					<SelectControl
						className={ classnames( className, 'woocommerce-filters-advanced__rule' ) }
						options={ rules }
						value={ rule }
						onChange={ partial( onFilterChange, key, 'rule' ) }
						aria-label={ labels.rule }
					/>
				),
				filter: (
					<Search
						className={ classnames( className, 'woocommerce-filters-advanced__input' ) }
						onChange={ this.onSearchChange }
						type={ input.type }
						placeholder={ labels.placeholder }
						selected={ selected }
						inlineTags
						aria-label={ labels.filter }
					/>
				),
			},
		} );

		const screenReaderText = this.getScreenReaderText( filter, config );

		/*eslint-disable jsx-a11y/no-noninteractive-tabindex*/
		return (
			<fieldset className="woocommerce-filters-advanced__line-item" tabIndex="0">
				<legend className="screen-reader-text">
					{ labels.add || '' }
				</legend>
				<div
					className={ classnames( 'woocommerce-filters-advanced__fieldset', {
						'is-english': isEnglish,
					} ) }
				>
					{ children }
				</div>
				{ screenReaderText && (
					<span className="screen-reader-text">
						{ screenReaderText }
					</span>
				) }
			</fieldset>
		);
		/*eslint-enable jsx-a11y/no-noninteractive-tabindex*/
	}
}

SearchFilter.propTypes = {
	/**
	 * The configuration object for the single filter to be rendered.
	 */
	config: PropTypes.shape( {
		labels: PropTypes.shape( {
			placeholder: PropTypes.string,
			rule: PropTypes.string,
			title: PropTypes.string,
		} ),
		rules: PropTypes.arrayOf( PropTypes.object ),
		input: PropTypes.object,
	} ).isRequired,
	/**
	 * The activeFilter handed down by AdvancedFilters.
	 */
	filter: PropTypes.shape( {
		key: PropTypes.string,
		rule: PropTypes.string,
		value: PropTypes.string,
	} ).isRequired,
	/**
	 * Function to be called on update.
	 */
	onFilterChange: PropTypes.func.isRequired,
	/**
	 * The query string represented in object form.
	 */
	query: PropTypes.object,
};

export default SearchFilter;
