import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
    FileText,
    Video,
    BookOpen,
    HelpCircle,
    Plus,
    Edit3,
    Check,
    X,
    Link,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

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
    const [label, setLabel] = useState(data.label || "Unnamed Node");
    const [resources, setResources] = useState(data.resources || []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
    const [newResource, setNewResource] = useState({
        name: "",
        type: "notes",
        url: "",
        completed: false,
    });

    const handleSaveEdit = () => {
        setIsEditing(false);
        // TODO: Update node data in backend if needed
    };

    const handleAddResource = () => {
        setIsAddResourceModalOpen(true);
    };

    const handleSaveResource = () => {
        if (!newResource.name || !newResource.url) {
            alert("Name and URL are required!");
            return;
        }
        const resource = {
            id: `resource-${Date.now()}`,
            ...newResource,
        };
        setResources([...resources, resource]);
        setIsAddResourceModalOpen(false);
        setNewResource({ name: "", type: "notes", url: "", completed: false });
        // TODO: Update resources in backend if needed
    };

    const toggleResourceComplete = (resourceId) => {
        const updated = resources.map((res) =>
            res.id === resourceId ? { ...res, completed: !res.completed } : res
        );
        setResources(updated);
        // TODO: Update resources in backend if needed
    };

    const allCompleted = resources.length > 0 && resources.every((res) => res.completed);

    return (
        <div className="group transition-colors duration-300">
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

            <Card
                className={`min-w-48 bg-card border border-muted shadow-card transition-colors duration-300 ${data.isRoot ? "border-primary border-2 shadow-glow" : ""
                    } ${isExpanded ? "min-h-64" : ""} ${allCompleted ? "bg-slate-800 text-slate-300" : ""
                    }`}
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
                                    const Icon = resourceIcons[resource.type] || FileText;
                                    return (
                                        <div
                                            key={resource.id}
                                            className={`flex items-center justify-between p-2 rounded-md ${resource.completed
                                                    ? "bg-green-100 border border-green-400 text-green-700"
                                                    : "bg-muted/30 hover:bg-muted/50 border border-muted text-text"
                                                } transition-colors group/resource cursor-pointer`}
                                            onClick={() => window.open(resource.url, "_blank")}
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Icon
                                                    className={`w-4 h-4 ${resource.completed
                                                            ? "text-green-600"
                                                            : resourceColors[resource.type]
                                                        } flex-shrink-0`}
                                                />
                                                <span
                                                    className={`text-xs truncate ${resource.completed ? "font-semibold" : ""
                                                        }`}
                                                >
                                                    {resource.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-6 h-6 p-0 opacity-0 group-hover/resource:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleResourceComplete(resource.id);
                                                    }}
                                                    title={
                                                        resource.completed ? "Mark as Undone" : "Mark as Done"
                                                    }
                                                >
                                                    {resource.completed ? (
                                                        <Check className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <Plus className="w-3 h-3" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-6 h-6 p-0 ml-1 opacity-0 group-hover/resource:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(resource.url, "_blank");
                                                    }}
                                                    title="Open Link"
                                                >
                                                    <Link className="w-3 h-3" />
                                                </Button>
                                            </div>
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

            {/* Add Resource Modal */}
            <Dialog open={isAddResourceModalOpen} onOpenChange={setIsAddResourceModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card text-text border border-muted p-6 rounded-lg">
                    <DialogTitle className="text-lg font-semibold">Add Resource</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Enter details for the new resource, including its name, type, and URL.
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="resource-name" className="text-sm font-medium">
                                Name
                            </label>
                            <Input
                                id="resource-name"
                                value={newResource.name}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, name: e.target.value })
                                }
                                placeholder="Enter resource name"
                                className="text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="resource-type" className="text-sm font-medium">
                                Type
                            </label>
                            <select
                                id="resource-type"
                                value={newResource.type}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, type: e.target.value })
                                }
                                className="text-sm border border-muted rounded-md p-2 bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="notes">Notes</option>
                                <option value="video">Video</option>
                                <option value="assignment">Assignment</option>
                                <option value="quiz">Quiz</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="resource-url" className="text-sm font-medium">
                                URL
                            </label>
                            <Input
                                id="resource-url"
                                value={newResource.url}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, url: e.target.value })
                                }
                                placeholder="Enter resource URL"
                                className="text-sm"
                                type="url"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddResourceModalOpen(false)}
                            className="text-sm border border-muted"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveResource} className="text-sm">
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(ResourceNode);