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
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
import { useUser, useAuth } from "@clerk/clerk-react";

function CircleNode({ data, isStart = false }) {
  const baseClasses =
    "relative w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold select-none";

  const classes = isStart
    ? `${baseClasses} border-green-600 bg-green-100 text-green-700`
    : `${baseClasses} border-red-600 bg-red-100 text-red-700`;

  return (
    <div className={classes}>
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


const nodeTypes = {
  resource: ResourceNode,
  start: (props) => <CircleNode {...props} isStart={true} />,
  end: (props) => <CircleNode {...props} isStart={false} />,
};

const initialNodes = [];
const initialEdges = [];

export default function MindMapView() {
  const { subjectId } = useParams();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isWebHandler, setIsWebHandler] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [mode, setMode] = useState("view"); // Default mode set to "view"
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_BACKEND_URL;

  // Debounced function to update node position
  const updateNodePosition = useCallback(
    debounce(async (nodeId, position) => {
      try {
        const response = await fetch(`${url}/res/node/${nodeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position,
            // Include data to avoid overwriting with null
            data: nodes.find((n) => n.id === nodeId)?.data || {},
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }
        toast.success(`Node position updated!`);
      } catch (error) {
        console.error(`Error updating node ${nodeId} position:`, error);
        toast.error(`Failed to update node position.`);
      }
    }, 500), // Debounce for 500ms
    [url, nodes]
  );

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        // Fetch subject data
        const subjectResponse = await fetch(`${url}/res/sub/${subjectId}`);
        if (!subjectResponse.ok) {
          throw new Error(`HTTP error! status: ${subjectResponse.status}`);
        }
        const subjectData = await subjectResponse.json();
        setSubjectName(subjectData.name || "Unnamed Subject");

        // Fetch nodes
        const nodePromises = subjectData.nodes.map(async (nodeId) => {
          const response = await fetch(`${url}/res/node/${nodeId}`);
          if (!response.ok) {
            throw new Error(`HTTP error fetching node ${nodeId}! status: ${response.status}`);
          }
          return response.json();
        });
        const nodeData = await Promise.all(nodePromises);

        // Map nodes to React Flow format
        setNodes(
          nodeData.map((node) => ({
            id: node._id,
            type: node.type,
            position: node.position,
            data: {
              label: node.data.label,
              resources: node.data.resources,
              isRoot: node.data.isRoot,
              isEditing: node.data.isEditing,
            },
            draggable: node.draggable,
          }))
        );

        // Fetch edges
        const edgePromises = subjectData.edges.map(async (edgeId) => {
          const response = await fetch(`${url}/res/edge/${edgeId}`);
          if (!response.ok) {
            throw new Error(`HTTP error fetching edge ${edgeId}! status: ${response.status}`);
          }
          return response.json();
        });
        const edgeData = await Promise.all(edgePromises);

        // Map edges to React Flow format
        setEdges(
          edgeData.map((edge) => ({
            id: edge._id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            type: edge.type || "default",
            style: edge.style || { stroke: "#555" },
            markerEnd: { type: "arrowclosed" },
            selectable: true,
          }))
        );

        toast.success("Subject data loaded successfully!");
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setSubjectName("Unnamed Subject");
        toast.error("Failed to load subject data.");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubjectData();
    }
  }, [subjectId, url, setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        draggable: mode === "edit" && isSignedIn && isWebHandler,
      }))
    );
  }, [mode, setNodes, isSignedIn, isWebHandler]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const response = await fetch(`${url}/api/users/${user.id}`);
          if (response.ok) {
            setIsWebHandler(true);
          } else {
            setIsWebHandler(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsWebHandler(false);
        }
      } else {
        setIsWebHandler(false);
      }
    };
    fetchUserData();
  }, [isLoaded, isSignedIn, user, url]);

  // Handle node position changes
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      if (mode !== "edit" || !isSignedIn || !isWebHandler) return;

      changes.forEach((change) => {
        if (change.type === "position" && change.position && change.dragging) {
          const nodeId = change.id;
          const newPosition = { x: change.position.x, y: change.position.y };
          updateNodePosition(nodeId, newPosition);
        }
      });
    },
    [onNodesChange, mode, updateNodePosition, isSignedIn, isWebHandler]
  );

  const onConnect = useCallback(
    async (params) => {
      if (mode !== "edit" || !isSignedIn || !isWebHandler) return;
      const newEdge = {
        ...params,
        type: "default",
        markerEnd: { type: "arrowclosed" },
        style: { stroke: "var(--primary)", strokeWidth: 2 },
        selectable: true,
      };
      try {
        const response = await fetch(`${url}/res/edge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject_id: subjectId,
            source: newEdge.source,
            target: newEdge.target,
            sourceHandle: newEdge.sourceHandle || null,
            targetHandle: newEdge.targetHandle || null,
            type: newEdge.type,
            style: newEdge.style,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }
        const savedEdge = await response.json();
        setEdges((eds) => addEdge({ ...newEdge, id: savedEdge._id }, eds));
        // Update subject with new edge
        await fetch(`${url}/res/sub/${subjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ edges: [...edges.map((e) => e.id), savedEdge._id] }),
        });
        toast.success("Edge created!");
      } catch (error) {
        console.error("Error creating edge:", error);
        toast.error("Failed to create edge.");
      }
    },
    [setEdges, mode, subjectId, url, edges, isSignedIn, isWebHandler]
  );

  const onEdgeUpdate = useCallback(
    async (oldEdge, newConnection) => {
      if (mode !== "edit" || !isSignedIn || !isWebHandler) return;
      try {
        const response = await fetch(`${url}/res/edge/${oldEdge.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: newConnection.source,
            target: newConnection.target,
            sourceHandle: newConnection.sourceHandle || null,
            targetHandle: newConnection.targetHandle || null,
            type: oldEdge.type,
            style: oldEdge.style,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEdges((els) =>
          els.map((edge) => {
            if (edge.id === oldEdge.id) {
              return {
                ...edge,
                source: newConnection.source,
                target: newConnection.target,
                sourceHandle: newConnection.sourceHandle || null,
                targetHandle: newConnection.targetHandle || null,
              };
            }
            return edge;
          })
        );
        toast.success("Edge updated!");
      } catch (error) {
        console.error("Error updating edge:", error);
        toast.error("Failed to update edge.");
      }
    },
    [setEdges, mode, url, isSignedIn, isWebHandler]
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      if (mode === "edit" && isSignedIn && isWebHandler) {
        setSelectedEdgeId(edge.id);
        setSelectedNodeId(null);
      }
    },
    [mode, isSignedIn, isWebHandler]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      if (mode === "edit" && isSignedIn && isWebHandler) {
        setSelectedNodeId(node.id);
        setSelectedEdgeId(null);
      }
    },
    [mode, isSignedIn, isWebHandler]
  );

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === "Delete" && mode === "edit" && isSignedIn && isWebHandler) {
        if (selectedEdgeId) {
          try {
            const response = await fetch(`${url}/res/edge/${selectedEdgeId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            setEdges((els) => els.filter((edge) => edge.id !== selectedEdgeId));
            // Update subject to remove edge
            await fetch(`${url}/res/sub/${subjectId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                edges: edges.filter((edge) => edge.id !== selectedEdgeId).map((e) => e.id),
              }),
            });
            setSelectedEdgeId(null);
            toast.success("Edge deleted!");
          } catch (error) {
            console.error("Error deleting edge:", error);
            toast.error("Failed to delete edge.");
          }
        } else if (selectedNodeId) {
          try {
            const response = await fetch(`${url}/res/node/${selectedNodeId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
            setEdges((els) =>
              els.filter(
                (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
              )
            );
            // Update subject to remove node and related edges
            await fetch(`${url}/res/sub/${subjectId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nodes: nodes.filter((node) => node.id !== selectedNodeId).map((n) => n.id),
                edges: edges
                  .filter(
                    (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
                  )
                  .map((e) => e.id),
              }),
            });
            setSelectedNodeId(null);
            toast.success("Node deleted!");
          } catch (error) {
            console.error("Error deleting node:", error);
            toast.error("Failed to delete node.");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEdgeId, selectedNodeId, setEdges, setNodes, mode, url, subjectId, nodes, edges, isSignedIn, isWebHandler]);

  const onPaneClick = useCallback(() => {
    if (mode === "edit" && isSignedIn && isWebHandler) {
      setSelectedEdgeId(null);
      setSelectedNodeId(null);
    }
  }, [mode, isSignedIn, isWebHandler]);

  const addNewNode = useCallback(
    async (nodeType) => {
      if (mode !== "edit" || !isSignedIn || !isWebHandler) return;
      const hasRoot = nodes.some((node) => node.data.isRoot && node.type === "resource");
      const newNode = {
        type: nodeType,
        position: {
          x: 250 + nodes.length * 100,
          y: 300,
        },
        data: {
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
          resources: [],
          isRoot: nodeType === "resource" && !hasRoot,
          isEditing: nodeType === "resource",
        },
        draggable: true,
      };
      try {
        const response = await fetch(`${url}/res/node`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject_id: subjectId,
            ...newNode,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }
        const savedNode = await response.json();
        setNodes((nds) => [
          ...nds,
          {
            id: savedNode._id,
            type: savedNode.type,
            position: savedNode.position,
            data: {
              label: savedNode.data.label,
              resources: savedNode.data.resources,
              isRoot: savedNode.data.isRoot,
              isEditing: savedNode.data.isEditing,
            },
            draggable: savedNode.draggable,
          },
        ]);
        // Update subject with new node
        await fetch(`${url}/res/sub/${subjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes: [...nodes.map((n) => n.id), savedNode._id] }),
        });
        toast.success(`New ${nodeType} node added!`);
      } catch (error) {
        console.error("Error creating node:", error);
        toast.error("Failed to create node.");
      }
    },
    [setNodes, nodes, mode, subjectId, url, isSignedIn, isWebHandler]
  );

  const handleAddNodeClick = () => {
    if (mode === "edit" && isSignedIn && isWebHandler) {
      setIsNodeModalOpen(true);
    }
  };

  const toggleMode = () => {
    if (isSignedIn && isWebHandler) {
      setMode((prev) => (prev === "edit" ? "view" : "edit"));
      setSelectedEdgeId(null);
      setSelectedNodeId(null);
    }
  };

  const nodeClassName = (node) => {
    switch (node.type) {
      case "resource":
        const allCompleted =
          node.data.resources.length > 0 &&
          node.data.resources.every((r) => r.completed);
        return `bg Cleveland
bg-card text-text border border-muted ${allCompleted ? "bg-slate-800 text-slate-300" : ""}`;
      case "start":
      case "end":
        return "hidden";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen bg-background text-text flex flex-col transition-colors duration-300">
      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text">Loading...</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
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
            nodesDraggable={mode === "edit" && isSignedIn && isWebHandler}
            nodesConnectable={mode === "edit" && isSignedIn && isWebHandler}
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
        )}

        {/* Fixed Center Title */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 text-center">
          <h1 className="text-lg font-semibold text-text">{subjectName.toUpperCase()}</h1>
          <p className="text-muted text-xs capitalize">Mind Map</p>
        </div>

        {/* Fixed Right Buttons */}
        <div className="absolute top-2 right-4 flex gap-2 z-50">
          <Button
            onClick={handleAddNodeClick}
            className="bg-card hover:bg-muted/20 text-text border border-muted text-sm py-1 px-3"
            variant="outline"
            disabled={mode === "view" || !isSignedIn || !isWebHandler}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Node
          </Button>
          <Button
            onClick={toggleMode}
            className="bg-card hover:bg-muted/20 text-text border border-muted text-sm py-1 px-3"
            variant="outline"
            title={mode === "edit" ? "Switch to View Mode" : "Switch to Edit Mode"}
            disabled={!isSignedIn || !isWebHandler}
          >
            {mode === "edit" ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>

        <AddNodeModal
          isOpen={isNodeModalOpen}
          onClose={() => setIsNodeModalOpen(false)}
          onSubmit={addNewNode}
          nodes={nodes}
        />
      </div>
    </div>
  );
}

