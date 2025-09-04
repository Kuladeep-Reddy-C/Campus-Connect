import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Map,
    GripVertical,
    Plus,
    Edit3,
    Check,
    X,
    ArrowRight,
} from "lucide-react";

function RoadmapNode({ id, data }) {
    const [isEditing, setIsEditing] = useState(data.isEditing || false);
    const [label, setLabel] = useState(data.label);
    const [description, setDescription] = useState(data.description || "");
    const [steps, setSteps] = useState(
        data.steps || [
            {
                id: "1",
                title: "Foundation",
                description: "Learn the basics",
                completed: false,
                estimatedTime: "2 hours",
                difficulty: "beginner",
            },
            {
                id: "2",
                title: "Practice",
                description: "Apply concepts",
                completed: false,
                estimatedTime: "3 hours",
                difficulty: "intermediate",
            },
            {
                id: "3",
                title: "Advanced",
                description: "Master complex topics",
                completed: false,
                estimatedTime: "4 hours",
                difficulty: "advanced",
            },
        ]
    );
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSaveEdit = () => {
        setIsEditing(false);
    };

    const handleAddStep = () => {
        const newStep = {
            id: `step-${Date.now()}`,
            title: "New Step",
            description: "Description",
            completed: false,
            estimatedTime: "1 hour",
            difficulty: "beginner",
        };
        setSteps([...steps, newStep]);
    };

    const toggleStepComplete = (stepId) => {
        setSteps(
            steps.map((step) =>
                step.id === stepId ? { ...step, completed: !step.completed } : step
            )
        );
    };

    const completedSteps = steps.filter((step) => step.completed).length;
    const progressPercentage = (completedSteps / steps.length) * 100;

    return (
        <div className="group">
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 border-2 border-assignment bg-node-bg"
            />

            <Card
                className={`
          min-w-64 bg-gradient-card border-assignment/20 shadow-card border-2
          transition-all duration-300 hover:shadow-glow hover:scale-105
          ${isExpanded ? "min-h-80" : ""}
        `}
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-assignment/10">
                            <Map className="w-5 h-5 text-assignment" />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={label}
                                            onChange={(e) => setLabel(e.target.value)}
                                            className="text-sm font-semibold"
                                            autoFocus
                                        />
                                        <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                                            <Check className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add description..."
                                        className="text-xs resize-none"
                                        rows={2}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-assignment text-sm">
                                            {label}
                                        </h3>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsEditing(true)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Edit3 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    {description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {description}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                        <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-assignment h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {completedSteps}/{steps.length} steps completed
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                        {(isExpanded ? steps : steps.slice(0, 2)).map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-2 p-2 rounded-md border ${step.completed
                                        ? "border-green-400 bg-green-50 text-green-800"
                                        : "border-node-border bg-node-bg"
                                    }`}
                            >
                                <GripVertical className="w-3 h-3 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium">{step.title}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {step.estimatedTime} • {step.difficulty}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleStepComplete(step.id)}
                                    className="text-xs"
                                >
                                    {step.completed ? "Undo" : "Done"}
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Expand / Add */}
                    <div className="flex justify-between mt-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs"
                        >
                            {isExpanded ? "Show Less" : "Show More"}
                            <ArrowRight
                                className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""
                                    }`}
                            />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleAddStep}>
                            <Plus className="w-3 h-3 mr-1" /> Add Step
                        </Button>
                    </div>
                </div>
            </Card>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 border-2 border-assignment bg-node-bg"
            />
        </div>
    );
}

export default memo(RoadmapNode);
