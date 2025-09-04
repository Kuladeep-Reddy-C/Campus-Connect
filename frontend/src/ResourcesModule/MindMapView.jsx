import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "./ui/button";
import { ArrowLeft, Plus, Eye, Edit3 } from "lucide-react";
import ResourceNode from "./ResourceNode";
import { AddNodeModal } from "./components/AddNodeModal";
import { toast } from "sonner";
import PropTypes from "prop-types";

// Circle node component for Start and End nodes
function CircleNode({ data, isStart = false }) {
  const baseClasses =
    "relative w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold select-none";

  const classes = isStart
    ? `${baseClasses} border-green-600 bg-green-100 text-green-700`
    : `${baseClasses} border-red-600 bg-red-100 text-red-700`;

  return (
    <div className={classes}>
      {/* Handles on all sides with unique IDs */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 border-2 border-primary bg-background"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 border-2 border-primary bg-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 border-2 border-primary bg-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 border-2 border-primary bg-background"
      />
      {data.label || "Unnamed"}
    </div>
  );
}

CircleNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
  isStart: PropTypes.bool,
};

const nodeTypes = {
  resource: ResourceNode,
  start: (props) => <CircleNode {...props} isStart={true} />,
  end: (props) => <CircleNode {...props} isStart={false} />,
};

const initialNodes = [
  {
    id: "start",
    type: "start",
    position: { x: 50, y: 300 },
    data: { label: "Start" },
    draggable: true,
  },
  {
    id: "1",
    type: "resource",
    position: { x: 250, y: 250 },
    data: {
      label: "Introduction",
      resources: [],
      isRoot: true,
    },
    draggable: true,
  },
  {
    id: "2",
    type: "resource",
    position: { x: 450, y: 350 },
    data: {
      label: "Basics",
      resources: [
        { id: "r1", name: "Fundamentals PDF", type: "notes", completed: false, url: "https://example.com/fundamentals.pdf" },
        { id: "r2", name: "Intro Video", type: "video", completed: false, url: "https://example.com/intro-video" },
      ],
    },
    draggable: true,
  },
  {
    id: "3",
    type: "resource",
    position: { x: 650, y: 250 },
    data: {
      label: "Advanced Topics",
      resources: [
        { id: "r3", name: "Advanced Assignment", type: "assignment", completed: true, url: "https://example.com/advanced-assignment" },
      ],
    },
    draggable: true,
  },
  {
    id: "end",
    type: "end",
    position: { x: 850, y: 300 },
    data: { label: "End" },
    draggable: true,
  },
];

const initialEdges = [
  {
    id: "e-start-1",
    source: "start",
    target: "1",
    // type: "bezier",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--primary)", strokeWidth: 2 },
    selectable: true,
  },
  {
    id: "e1-2",
    source: "1",
    target: "2",
    // type: "bezier",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--primary)", strokeWidth: 2 },
    selectable: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    // type: "bezier",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--primary)", strokeWidth: 2 },
    selectable: true,
  },
  {
    id: "e3-end",
    source: "3",
    target: "end",
    // type: "bezier",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--primary)", strokeWidth: 2 },
    selectable: true,
  },
];

export function MindMapView({ branch, subject, onBack }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [mode, setMode] = useState("edit");

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        draggable: mode === "edit",
      }))
    );
  }, [mode, setNodes]);

  const onConnect = useCallback(
    (params) =>
      mode === "edit"
        ? setEdges((eds) =>
          addEdge(
            {
              ...params,
              // type: "bezier",
              markerEnd: { type: "arrowclosed" },
              style: { stroke: "var(--primary)", strokeWidth: 2 },
              selectable: true,
            },
            eds
          )
        )
        : null,
    [setEdges, mode]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      mode === "edit"
        ? setEdges((els) =>
          els.map((edge) => {
            if (edge.id === oldEdge.id) {
              return {
                ...edge,
                source: newConnection.source,
                target: newConnection.target,
                sourceHandle: newConnection.sourceHandle,
                targetHandle: newConnection.targetHandle,
              };
            }
            return edge;
          })
        )
        : null,
    [setEdges, mode]
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      if (mode === "edit") {
        setSelectedEdgeId(edge.id);
        setSelectedNodeId(null);
      }
    },
    [mode]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      if (mode === "edit") {
        setSelectedNodeId(node.id);
        setSelectedEdgeId(null);
      }
    },
    [mode]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && mode === "edit") {
        if (selectedEdgeId) {
          setEdges((els) => els.filter((edge) => edge.id !== selectedEdgeId));
          setSelectedEdgeId(null);
          toast.success("Edge deleted!");
        } else if (selectedNodeId) {
          setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
          setEdges((els) =>
            els.filter(
              (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
            )
          );
          setSelectedNodeId(null);
          toast.success("Node deleted!");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEdgeId, selectedNodeId, setEdges, setNodes, mode]);

  const onPaneClick = useCallback(() => {
    if (mode === "edit") {
      setSelectedEdgeId(null);
      setSelectedNodeId(null);
    }
  }, [mode]);

  const addNewNode = useCallback(
    (nodeType) => {
      if (mode !== "edit") return;
      const newNode = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position: {
          x: 250 + nodes.length * 100,
          y: 300,
        },
        data: {
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
          resources: nodeType === "resource" ? [] : undefined,
          isEditing: nodeType === "resource",
        },
        draggable: true,
      };
      setNodes((nds) => [...nds, newNode]);
      toast.success(`New ${nodeType} node added!`);
    },
    [setNodes, nodes.length, mode]
  );

  const handleAddNodeClick = () => {
    if (mode === "edit") {
      setIsNodeModalOpen(true);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "edit" ? "view" : "edit"));
    setSelectedEdgeId(null);
    setSelectedNodeId(null);
  };

  const nodeClassName = (node) => {
    switch (node.type) {
      case "resource":
        const allCompleted =
          node.data.resources.length > 0 &&
          node.data.resources.every((r) => r.completed);
        return `bg-card text-text border border-muted ${allCompleted ? "bg-slate-800 text-slate-300" : ""}`;
      case "start":
      case "end":
        return "hidden";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen bg-background text-text flex flex-col transition-colors duration-300">
      <div className="bg-card border-b border-muted px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-text hover:bg-muted/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-text">{subject.toUpperCase()}</h1>
            <p className="text-muted text-xs capitalize">{branch} • Mind Map</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddNodeClick}
            className="bg-card hover:bg-muted/20 text-text border border-muted text-sm py-1 px-3"
            variant="outline"
            disabled={mode === "view"}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Node
          </Button>
          <Button
            onClick={toggleMode}
            className="bg-card hover:bg-muted/20 text-text border border-muted text-sm py-1 px-3"
            variant="outline"
            title={mode === "edit" ? "Switch to View Mode" : "Switch to Edit Mode"}
          >
            {mode === "edit" ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
          attributionPosition="bottom-left"
          panOnScroll={true}
          zoomOnScroll={true}
          nodesDraggable={mode === "edit"}
          nodesConnectable={mode === "edit"}
        >
          <Controls
            className="bg-card border border-muted shadow-sm text-text"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--text)",
              borderColor: "var(--muted)",
            }}
          />
          <MiniMap
            nodeClassName={nodeClassName}
            className="bg-card border border-muted shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--muted)",
            }}
            pannable
            zoomable
          />
          <Background gap={20} size={1} color="var(--muted)" />
        </ReactFlow>

        <AddNodeModal
          isOpen={isNodeModalOpen}
          onClose={() => setIsNodeModalOpen(false)}
          onSubmit={addNewNode}
        />
      </div>
    </div>
  );
}

MindMapView.propTypes = {
  branch: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};