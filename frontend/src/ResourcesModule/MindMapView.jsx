import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "./ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import ResourceNode from "./ResourceNode";
import RoadmapNode from "./RoadmapNode";
import { RoadmapCreator } from "./RoadmapCreator";
import { toast } from "sonner";

const nodeTypes = {
  resource: ResourceNode,
  roadmap: RoadmapNode,
};

const initialNodes = [
  {
    id: "1",
    type: "resource",
    position: { x: 400, y: 200 },
    data: {
      label: "Introduction",
      resources: [],
      isRoot: true,
    },
  },
  {
    id: "2",
    type: "resource",
    position: { x: 200, y: 350 },
    data: {
      label: "Basics",
      resources: [
        { id: "r1", name: "Fundamentals PDF", type: "notes" },
        { id: "r2", name: "Intro Video", type: "video" },
      ],
    },
  },
  {
    id: "3",
    type: "resource",
    position: { x: 600, y: 350 },
    data: {
      label: "Advanced Topics",
      resources: [{ id: "r3", name: "Advanced Assignment", type: "assignment" }],
    },
  },
  {
    id: "4",
    type: "roadmap",
    position: { x: 400, y: 500 },
    data: {
      label: "Learning Path",
      description: "Suggested sequence for mastering this subject",
    },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--primary)", strokeWidth: 2 },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--primary)", strokeWidth: 2 },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--muted)", strokeWidth: 2 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
    style: { stroke: "var(--muted)", strokeWidth: 2 },
  },
];

export function MindMapView({ branch, subject, onBack }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isRoadmapCreatorOpen, setIsRoadmapCreatorOpen] = useState(false);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            markerEnd: { type: "arrowclosed" },
            style: { stroke: "var(--primary)", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNewNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: "resource",
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 300 },
      data: {
        label: "New Topic",
        resources: [],
        isEditing: true,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setIsAddingNode(false);
    toast.success("New topic node added!");
  }, [setNodes]);

  const handleCreateRoadmap = useCallback(
    (roadmapData) => {
      const newRoadmapNode = {
        id: `roadmap-${Date.now()}`,
        type: "roadmap",
        position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 300 },
        data: {
          label: roadmapData.title,
          description: roadmapData.description,
          steps: roadmapData.steps.map((step) => ({
            id: step.id,
            title: step.title,
            description: step.description,
            estimatedTime: step.estimatedTime,
            difficulty: step.difficulty,
            completed: false,
          })),
        },
      };

      setNodes((nds) => [...nds, newRoadmapNode]);
      toast.success(`Roadmap "${roadmapData.title}" created successfully!`);
    },
    [setNodes]
  );

  const nodeClassName = (node) => {
    switch (node.type) {
      case "resource":
        return "bg-card text-text border border-muted";
      case "roadmap":
        return "bg-primary text-text border border-muted";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen bg-background text-text flex flex-col transition-colors duration-300">
      {/* Header */}
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
            <p className="text-muted text-xs capitalize">
              {branch} • Mind Map
            </p>
          </div>
        </div>
        <Button
          onClick={addNewNode}
          className="bg-card hover:bg-muted/20 text-text border border-muted text-sm py-1 px-3"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Node
        </Button>
      </div>

      {/* Mind Map */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
          attributionPosition="bottom-left"
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

        {/* Roadmap Creator Modal */}
        <RoadmapCreator
          open={isRoadmapCreatorOpen}
          onClose={() => setIsRoadmapCreatorOpen(false)}
          onSave={handleCreateRoadmap}
        />
      </div>
    </div>
  );
}