import {dia, highlighters, shapes} from "@joint/core";
import log from "loglevel";
import Graph = dia.Graph;
import Paper = dia.Paper;

export default class CustomGraph {
    private _logger = log.getLogger('CustomGraph');
    private _graph: Graph;
    private _paper: Paper;
    private _drop: { id: string, x: number, y: number };
    private _on = [];
    private _lastClicked: { id: string, type: 'element' | 'edge' };

    constructor(el: HTMLElement) {
        document.addEventListener('keydown', (evt) => {
            if (this._lastClicked && evt.key === 'Backspace') {
                this._logger.debug(this._lastClicked);
                this._logger.debug(evt);
                this._on['delete']({id: this._lastClicked.id});
            }
        });
        this._graph = new Graph({}, {cellNamespace: shapes});
        this._paper = new dia.Paper({
            el: el,
            width: 800,
            height: 800,
            model: this._graph,
            async: true,
            gridSize: 10,
            cellViewNamespace: shapes,
            drawGrid: {name: "fixedDot"},
            background: {
                color: 'rgba(0, 0, 0, 0.1)'
            }
        });
        this._paper.on('cell:pointerup', (cellView, evt, x, y) => {
            if (this._drop) {
                evt.preventDefault();
                this._logger.debug(this._drop);
                if (this._on['drop']) {
                    this._on['drop']({id: this._drop.id, x: this._drop.x, y: this._drop.y});
                }
                this._drop = null;
            }
            // this._logger.debug('cell:pointerup', cellView.data.model.id, x, y);
        });
        this._paper.on('link:pointerclick', (cell, evt) => {
            this._logger.debug('link:pointerclick', cell.model.id);
            highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
            this._lastClicked = {id: cell.model.id as string, type: 'edge'};

        });
        this._paper.on('element:pointerclick', (cell, evt) => {
            this._logger.debug(evt);
            this._logger.debug('pointerclick', cell.model.id);
            if (this._lastClicked) {
                if (this._lastClicked?.id != cell.model.id) {
                    if (this._lastClicked.type == 'element') {
                        //this.createEdge(this._lastClicked.id, cell.model.id as string);
                        if (this._on['connect']) {
                            this._on['connect']({source: this._lastClicked.id, destination: cell.model.id});
                        }
                    }
                }
                highlighters.mask.removeAll(this._paper);
                this._lastClicked = null;
            } else {
                highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
                this._lastClicked = {id: cell.model.id as string, type: 'element'};
            }
        });
    }

    public on(name, callback: (event: any) => void) {
        this._on[name] = callback;
    }

    public updateGraph(components, connections, layout) {
        this._graph.clear();
        //const cells = this._graph.getCells().map((cell) => {return {id: cell.id, present: false, cell: cell}});
        components.forEach((component) => {
            const comp = component as unknown as { _id: string, name: string };
            const pos = layout[comp._id]?.position || {x: 10, y: 10};
            this.createNode(comp._id, pos.x, pos.y, comp.name);
            /*if (cells.find((cell) => cell.id == comp._id)) {
                cells.find((cell) => cell.id == comp._id).present = true;
            }*/
        })
        connections.forEach((connection) => {
            const comp = connection as unknown as { _id: string, source: string, destination: string };
            try {
                this._logger.debug('createEdge', comp);
                this.createEdge(comp._id, comp.source, comp.destination);
                /*if (cells.find((cell) => cell.id == comp._id)) {
                    cells.find((cell) => cell.id == comp._id).present = true;
                }*/
            } catch (err) {
                this._logger.error(err);
                this._on['delete']({id: comp._id});
            }
        })
        /*this._logger.debug('cells', cells);
        cells.forEach((cell) => {
            if (!cell.present) {
                this._logger.debug('delete', cell.id);
            }});

         */
    }

    public createNode(id: string, x: number, y: number, name: string) {
        const exists = this._graph.getCell(id) != null;
        if (exists) {
            return exists;
        }
        const rect = new shapes.standard.Rectangle(
            {
                id: id,
                position: {x: x, y: y},
                size: {width: 100, height: 40},
                attrs: {
                    body: {
                        fill: '#00f',
                        rx: 10,
                        ry: 10,
                        strokeWidth: 2,
                        stroke: '#00c'
                    },
                    label: {
                        text: name,
                        fill: 'white'
                    }
                }
            }
        );

        const cell = this._graph.addCell(rect);
        cell.on('change:position', (cell, position) => {
            this._drop = {id: cell.id, x: position.x, y: position.y};
        })
        this._logger.debug('createNode', id, x, y, name, exists);
        return rect;
    }

    public createEdge(id: string, source: string, target: string, color: string = '#fff') {
        const exists = this._graph.getLinks().find((link) => {
            return link.source.id == source && link.target.id == target;
        }) != null;
        if (exists) {
            return exists;
        }
        this._logger.debug('createEdge', source, target, exists);

        const link = new shapes.standard.Link({
            id: id,
            source: {id: source},
            target: {id: target},
            attrs: {
                line: {
                    stroke: color,
                    strokeWidth: 1,
                    targetMarker: {
                        name: 'classic'
                    }
                }
            }
        });
        try {
            const s = this._graph.getCell(source);
            const d = this._graph.getCell(target);
            if (s && d) {
                this._graph.addCell(link);
            } else {
                this._logger.error('source', s);
                this._logger.error('destination', d);
                throw new Error('missing connection');
            }
        } catch (err) {
            this._logger.error(err);
            throw new Error('missing connection');
        }
    }
}