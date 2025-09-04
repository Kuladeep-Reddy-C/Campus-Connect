import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
    FileText,
    Video,
    BookOpen,
    HelpCircle,
    Plus,
    Edit3,
    Check,
    X,
    Download,
} from "lucide-react";

const resourceIcons = {
    notes: FileText,
    video: Video,
    assignment: BookOpen,
    quiz: HelpCircle,
};

const resourceColors = {
    notes: "text-notes",
    video: "text-video",
    assignment: "text-assignment",
    quiz: "text-quiz",
};

function ResourceNode({ id, data }) {
    const [isEditing, setIsEditing] = useState(data.isEditing || false);
    const [label, setLabel] = useState(data.label);
    const [resources, setResources] = useState(data.resources);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSaveEdit = () => {
        setIsEditing(false);
        // TODO: update node data in state/store if needed
    };

    const handleAddResource = () => {
        const newResource = {
            id: `resource-${Date.now()}`,
            name: "New Resource",
            type: "notes",
        };
        setResources([...resources, newResource]);
    };

    return (
        <div className="group transition-colors duration-300">
            {/* Incoming connection */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 border-2 border-primary bg-background"
            />

            <Card
                className={`
          min-w-48 bg-card border border-muted shadow-card
          transition-all duration-300 hover:shadow-glow hover:scale-105
          ${data.isRoot ? "border-primary border-2 shadow-glow" : ""}
          ${isExpanded ? "min-h-64" : ""}
        `}
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
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
                        ) : (
                            <>
                                <h3
                                    className={`font-semibold text-sm ${data.isRoot ? "text-primary" : "text-foreground"
                                        }`}
                                >
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
                            </>
                        )}
                    </div>

                    {/* Resources badge */}
                    {resources.length > 0 && (
                        <div className="flex items-center justify-between mb-3">
                            <Badge
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {resources.length} resource{resources.length !== 1 ? "s" : ""}
                            </Badge>
                            {!isExpanded && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsExpanded(true)}
                                    className="text-xs opacity-60 hover:opacity-100"
                                >
                                    View All
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Resource list */}
                    {(isExpanded || resources.length <= 2) && (
                        <div className="space-y-2 mb-3">
                            {resources
                                .slice(0, isExpanded ? undefined : 2)
                                .map((resource) => {
                                    const Icon = resourceIcons[resource.type];
                                    return (
                                        <div
                                            key={resource.id}
                                            className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors group/resource"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Icon
                                                    className={`w-4 h-4 ${resourceColors[resource.type]} flex-shrink-0`}
                                                />
                                                <span className="text-xs truncate">
                                                    {resource.name}
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="w-6 h-6 p-0 opacity-0 group-hover/resource:opacity-100 transition-opacity"
                                            >
                                                <Download className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {/* Add resource */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddResource}
                        className="w-full text-xs border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Resource
                    </Button>
                </div>
            </Card>

            {/* Outgoing connection */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 border-2 border-primary bg-background"
            />
        </div>
    );
}

export default memo(ResourceNode);
