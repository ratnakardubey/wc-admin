<?php
/**
 * Class for parameter-based Order Stats Reports querying
 *
 * Example usage:
 * $args = array(
 *          'before'       => '2018-07-19 00:00:00',
 *          'after'        => '2018-07-05 00:00:00',
 *          'interval'     => 'week',
 *          'categories'   => array(15, 18),
 *          'coupons'      => array(138),
 *          'status_in'    => array('completed'),
 *         );
 * $report = new WC_Admin_Reports_Orders_Stats_Query( $args );
 * $mydata = $report->get_data();
 *
 * @package  WooCommerce Admin/Classes
 */

defined( 'ABSPATH' ) || exit;

/**
 * WC_Admin_Reports_Orders_Stats_Query
 */
class WC_Admin_Reports_Orders_Stats_Query extends WC_Admin_Reports_Query {

	/**
	 * Valid fields for Orders report.
	 *
	 * @return array
	 */
	protected function get_default_query_vars() {
		return array(
			'fields' => array(
				'net_revenue',
				'avg_order_value',
				'orders_count',
				'avg_items_per_order',
				'num_items_sold',
				'coupons',
				'num_returning_customers',
				'num_new_customers',
			),
		);
	}

	/**
	 * Get revenue data based on the current query vars.
	 *
	 * @return array
	 */
	public function get_data() {
		$args = apply_filters( 'woocommerce_reports_orders_stats_query_args', $this->get_query_vars() );

		$data_store = WC_Data_Store::load( 'report-orders-stats' );
		$results    = $data_store->get_data( $args );
		return apply_filters( 'woocommerce_reports_orders_stats_select_query', $results, $args );
	}

}
