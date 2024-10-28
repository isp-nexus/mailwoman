/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 * @template GraphNode
 * @class
 */

class Graph {
	constructor() {
		/**
		 * @type {Record<string, GraphNode[]>}
		 */
		this.edges = {}
	}

	/**
	 * Add a node to the graph.
	 *
	 * @param {string} relationship
	 * @param {GraphNode} node
	 *
	 * @returns {boolean}
	 */
	add(relationship, node) {
		if (!this.edges[relationship]) {
			this.edges[relationship] = []
		}
		if (!this.edges[relationship].includes(node)) {
			this.edges[relationship].push(node)
			return true
		}
		return false
	}

	/**
	 * Remove a node from the graph.
	 *
	 * @param {string} relationship
	 * @param {GraphNode} node
	 *
	 * @returns {boolean}
	 */
	remove(relationship, node) {
		if (!this.edges[relationship]) {
			return false
		}

		const len = this.edges[relationship].length
		this.edges[relationship] = this.edges[relationship].filter((n) => n !== node)

		if (!this.edges[relationship].length) {
			delete this.edges[relationship]
			return true
		}

		return this.edges[relationship].length !== len
	}

	/**
	 * Get the number of relationships in the graph.
	 *
	 * @param {string} relationship
	 */
	length(relationship) {
		if (!this.edges[relationship]) {
			return 0
		}

		return this.edges[relationship].length
	}

	/**
	 * Find all nodes in a relationship.
	 *
	 * @param {string} relationship
	 *
	 * @returns {GraphNode[]}
	 */
	findAll(relationship) {
		if (this.length(relationship) < 1) {
			return []
		}
		return this.edges[relationship]
	}

	/**
	 * Find one node in a relationship.
	 *
	 * @param {string} relationship
	 *
	 * @returns {GraphNode | null}
	 */
	findOne(relationship) {
		if (this.length(relationship) < 1) {
			return null
		}
		return this.edges[relationship][0]
	}

	/**
	 * Predicate to determine if a relationship has a node that satisfies a condition.
	 *
	 * @param {string} relationship
	 * @param {(node: GraphNode) => boolean} func
	 *
	 * @returns {boolean}
	 */
	some(relationship, func) {
		if (this.length(relationship) < 1) {
			return false
		}

		return this.edges[relationship].some(func)
	}

	/**
	 * Predicate to determine if all nodes in a relationship satisfy a condition.
	 *
	 * @param {string} relationship
	 * @param {(node: GraphNode) => boolean} func
	 *
	 * @returns {boolean}
	 */
	every(relationship, func) {
		if (this.length(relationship) < 1) {
			return false
		}
		return this.edges[relationship].every(func)
	}
}

module.exports = Graph
