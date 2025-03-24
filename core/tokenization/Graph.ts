/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { Sequence } from "mailwoman/core/resources"

export type GraphNodeCallback<G> = (node: G) => boolean

/**
 * A graph structure for storing relationships between nodes.
 */
export class Graph<GraphNode extends WeakKey> {
	/**
	 * Parents of the graph, i.e. upward connections to the graph.
	 */
	public parents: Sequence<GraphNode> = new Sequence()

	/**
	 * Children of the graph, i.e. downward connections to the graph.
	 */
	public children: Sequence<GraphNode> = new Sequence()

	/**
	 * Previous siblings of the graph, i.e. leftward connections to the graph.
	 */
	public readonly previousSiblings = new Sequence<GraphNode>()
	/**
	 * Next siblings of the graph, i.e. rightward connections to the graph.
	 */
	public readonly nextSiblings = new Sequence<GraphNode>()

	/**
	 * Phrases identified in the graph, i.e. a sequence of nodes composing a classification.
	 */
	public readonly phrases: Sequence<GraphNode> = new Sequence<GraphNode>()

	public get nextSibling(): GraphNode | null {
		return this.nextSiblings.first
	}

	public get previousSibling(): GraphNode | null {
		return this.previousSiblings.first
	}
}
